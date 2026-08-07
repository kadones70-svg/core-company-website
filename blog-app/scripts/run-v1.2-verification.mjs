import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const EVIDENCE = path.resolve(process.env.QA_EVIDENCE_DIR ?? path.join(ROOT, 'review', 'v1.2'));
const LOGS = path.join(EVIDENCE, 'logs');
const NODE_DIRECTORY = path.dirname(process.execPath);
const NPM_CLI = path.join(NODE_DIRECTORY, 'node_modules', 'npm', 'bin', 'npm-cli.js');
const commands = [];

await mkdir(LOGS, { recursive: true });

async function ensureFile(file) {
  try {
    await access(file);
  } catch {
    throw new Error(`필요한 실행 파일이 없습니다: ${file}`);
  }
}

function runProcess(command, args, environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, ...environment },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const output = [];
    child.stdout.on('data', (chunk) => {
      output.push(chunk);
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      output.push(chunk);
      process.stderr.write(chunk);
    });
    child.once('error', reject);
    child.once('close', (exitCode) => resolve({
      exitCode: exitCode ?? 1,
      output: Buffer.concat(output).toString('utf8'),
    }));
  });
}

const sharedEnvironment = {
  PATH: `${NODE_DIRECTORY};${process.env.PATH ?? ''}`,
  QA_EVIDENCE_DIR: EVIDENCE,
  LIGHTHOUSE_OUTPUT_DIR: path.join(EVIDENCE, 'lighthouse'),
};

async function runStep(label, displayCommand, command, args, environment = {}) {
  const index = String(commands.length + 1).padStart(2, '0');
  const startedAt = new Date().toISOString();
  console.log(`\n[${index}] ${displayCommand}`);
  const result = await runProcess(command, args, { ...sharedEnvironment, ...environment });
  const finishedAt = new Date().toISOString();
  const logFile = `logs/${index}-${label}.log`;
  await writeFile(path.join(EVIDENCE, logFile), result.output, 'utf8');
  commands.push({ index: Number(index), label, command: displayCommand, startedAt, finishedAt, exitCode: result.exitCode, logFile });
  await writeFile(path.join(EVIDENCE, 'commands.json'), `${JSON.stringify(commands, null, 2)}\n`, 'utf8');
  await writeFile(
    path.join(EVIDENCE, 'commands-summary.txt'),
    `${commands.map((item) => `${item.index}\tEXIT=${item.exitCode}\t${item.command}\t${item.logFile}`).join('\n')}\n`,
    'utf8',
  );
  if (result.exitCode !== 0) throw new Error(`${displayCommand} 실패 (exit ${result.exitCode})`);
}

async function npmRun(script) {
  await runStep(script.replaceAll(':', '-'), `npm run ${script}`, process.execPath, [NPM_CLI, 'run', script]);
}

async function collect(mode) {
  await runStep(
    `collect-${mode}`,
    `node scripts/collect-v1.2-evidence.mjs ${mode}`,
    process.execPath,
    [path.join(ROOT, 'scripts', 'collect-v1.2-evidence.mjs'), mode],
  );
}

await ensureFile(NPM_CLI);
const versionResult = await runProcess(process.execPath, ['--version'], sharedEnvironment);
const npmVersionResult = await runProcess(process.execPath, [NPM_CLI, '--version'], sharedEnvironment);
const nodeInfo = {
  recordedAt: new Date().toISOString(),
  command: 'node --version',
  version: versionResult.output.trim(),
  execPath: process.execPath,
  npmVersion: npmVersionResult.output.trim(),
  platform: process.platform,
  arch: process.arch,
};
await writeFile(path.join(EVIDENCE, 'node-version.json'), `${JSON.stringify(nodeInfo, null, 2)}\n`, 'utf8');
await writeFile(
  path.join(EVIDENCE, 'node-version.txt'),
  `node --version\t${nodeInfo.version}\nnode executable\t${nodeInfo.execPath}\nnpm --version\t${nodeInfo.npmVersion}\n`,
  'utf8',
);
console.log(`Node final verification: ${nodeInfo.version} (${nodeInfo.execPath})`);
if (!/^v24\./.test(nodeInfo.version)) {
  throw new Error(`Node 24 LTS가 아닙니다: ${nodeInfo.version}`);
}

await npmRun('content:validate');
await npmRun('check');
await npmRun('test');
await npmRun('build:review');
await npmRun('test');
await npmRun('test:e2e');
await npmRun('lighthouse');
await collect('review');
await npmRun('build');
await npmRun('test');
await npmRun('review:screenshots:v1.2:production');
await collect('production');
await collect('screenshots');

console.log(`\nV1.2 Node 24 verification complete: ${commands.length} commands passed.`);

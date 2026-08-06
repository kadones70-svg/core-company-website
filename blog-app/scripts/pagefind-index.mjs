import { spawn } from 'node:child_process';
import { access, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const ARTICLES = path.join(DIST, 'articles');
const PLACEHOLDER = path.join(DIST, '__pagefind-empty-index.html');
const PAGEFIND_CLI = path.join(ROOT, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs');

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

function runPagefind() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [PAGEFIND_CLI, '--site', 'dist', '--force-language', 'ko'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`Pagefind exited with ${code}`)));
  });
}

const needsPlaceholder = !(await exists(ARTICLES));
try {
  if (needsPlaceholder) {
    await writeFile(
      PLACEHOLDER,
      '<!doctype html><html lang="ko"><head><meta name="robots" content="noindex"></head><body><main data-pagefind-body><h1>corecompanyemptypublishindex</h1></main></body></html>',
      'utf8',
    );
  }
  await runPagefind();
} finally {
  if (needsPlaceholder && await exists(PLACEHOLDER)) await unlink(PLACEHOLDER);
}

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'review', 'lighthouse');
const HOST = '127.0.0.1';
const PREVIEW_PORT = 4322;
const PAGES = [
  { name: 'home', url: `http://${HOST}:${PREVIEW_PORT}/blog/` },
  { name: 'editorial-policy', url: `http://${HOST}:${PREVIEW_PORT}/blog/editorial-policy/` },
];

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function startPreview() {
  const astroCli = path.join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs');
  const child = spawn(process.execPath, [astroCli, 'preview', '--host', HOST, '--port', String(PREVIEW_PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Astro preview start timeout')), 30_000);
    const onData = (chunk) => {
      const output = chunk.toString();
      process.stdout.write(output);
      if (/Local|ready in/i.test(output)) {
        clearTimeout(timeout);
        resolve(child);
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.once('error', (error) => { clearTimeout(timeout); reject(error); });
    child.once('exit', (code) => {
      if (code !== null && code !== 0) { clearTimeout(timeout); reject(new Error(`Astro preview exited with ${code}`)); }
    });
  });
}

function scoreSummary(lhr) {
  return Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map((key) => [key, Math.round((lhr.categories[key]?.score ?? 0) * 100)]));
}

function assertThresholds(name, lhr) {
  const scores = scoreSummary(lhr);
  const cls = lhr.audits['cumulative-layout-shift']?.numericValue ?? Number.POSITIVE_INFINITY;
  const errors = [];
  if (scores.performance < 95) errors.push(`Performance ${scores.performance} < 95`);
  if (scores.accessibility < 100) errors.push(`Accessibility ${scores.accessibility} < 100`);
  if (scores['best-practices'] < 100) errors.push(`Best Practices ${scores['best-practices']} < 100`);
  if (scores.seo < 100) errors.push(`SEO ${scores.seo} < 100`);
  if (cls >= 0.1) errors.push(`CLS ${cls.toFixed(3)} >= 0.1`);
  console.log(`${name}: Performance ${scores.performance}, Accessibility ${scores.accessibility}, Best Practices ${scores['best-practices']}, SEO ${scores.seo}, CLS ${cls.toFixed(3)}`);
  if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
  return { ...scores, cls };
}

let preview;
let browser;
try {
  await mkdir(OUTPUT_DIR, { recursive: true });
  preview = await startPreview();

  const chromePort = await availablePort();
  browser = await chromium.launch({
    headless: true,
    args: [`--remote-debugging-port=${chromePort}`, '--remote-allow-origins=*', '--disable-gpu'],
  });

  const summaries = {};
  for (const page of PAGES) {
    const result = await lighthouse(page.url, {
      port: chromePort,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
      throttlingMethod: 'simulate',
    });
    if (!result) throw new Error(`Lighthouse produced no result for ${page.url}`);
    await writeFile(path.join(OUTPUT_DIR, `${page.name}.html`), result.report, 'utf8');
    await writeFile(path.join(OUTPUT_DIR, `${page.name}.json`), JSON.stringify(result.lhr, null, 2), 'utf8');
    summaries[page.name] = assertThresholds(page.name, result.lhr);
  }
  await writeFile(path.join(OUTPUT_DIR, 'summary.json'), JSON.stringify(summaries, null, 2), 'utf8');
  console.log(`Lighthouse reports: ${OUTPUT_DIR}`);
} finally {
  if (browser) await browser.close();
  if (preview && !preview.killed) preview.kill();
}

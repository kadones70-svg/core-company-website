import { access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_IMAGE_DIRECTORY = path.join(PROJECT_ROOT, 'public', 'images', 'posts');
const ALLOWED_ROOT = path.join(PROJECT_ROOT, 'public', 'images');
const CONVERTIBLE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const REPORTABLE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function isInsideAllowedRoot(target) {
  const relative = path.relative(ALLOWED_ROOT, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function collectImages(target, output) {
  const info = await stat(target);
  if (info.isFile()) {
    if (REPORTABLE_EXTENSIONS.has(path.extname(target).toLocaleLowerCase('en-US'))) output.push(target);
    return;
  }
  if (!info.isDirectory()) return;

  const entries = await readdir(target, { withFileTypes: true });
  for (const entry of entries) {
    await collectImages(path.join(target, entry.name), output);
  }
}

function parseArguments(argv) {
  const options = { maxWidth: 1920, quality: 82, force: false, inputs: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--force') options.force = true;
    else if (argument === '--max-width') options.maxWidth = Number.parseInt(argv[++index], 10);
    else if (argument === '--quality') options.quality = Number.parseInt(argv[++index], 10);
    else if (argument === '--help' || argument === '-h') options.help = true;
    else options.inputs.push(argument);
  }
  if (!Number.isInteger(options.maxWidth) || options.maxWidth < 320 || options.maxWidth > 7680) {
    throw new Error('--max-width는 320~7680 사이의 정수여야 합니다.');
  }
  if (!Number.isInteger(options.quality) || options.quality < 40 || options.quality > 100) {
    throw new Error('--quality는 40~100 사이의 정수여야 합니다.');
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log('사용법: npm run image:optimize -- [public/images 아래 파일·폴더] [--max-width 1920] [--quality 82] [--force]');
    console.log('원본은 삭제하거나 덮어쓰지 않으며 PNG/JPEG 옆에 WebP 변환본을 만듭니다.');
    return;
  }

  const requested = options.inputs.length
    ? options.inputs.map((input) => path.resolve(PROJECT_ROOT, input))
    : [DEFAULT_IMAGE_DIRECTORY];

  for (const target of requested) {
    if (!isInsideAllowedRoot(target)) throw new Error(`public/images 밖의 경로는 처리하지 않습니다: ${target}`);
  }

  const existingInputs = [];
  for (const target of requested) {
    if (await exists(target)) existingInputs.push(target);
    else console.warn(`입력 경로가 없어 건너뜁니다: ${path.relative(PROJECT_ROOT, target)}`);
  }
  if (!existingInputs.length) {
    console.log('처리할 이미지가 없습니다. 원본을 public/images/posts/<slug>/에 추가한 뒤 다시 실행하세요.');
    return;
  }

  const imageFiles = [];
  for (const target of existingInputs) await collectImages(target, imageFiles);
  const uniqueFiles = [...new Set(imageFiles.map((file) => path.resolve(file)))].sort((a, b) => a.localeCompare(b, 'en'));
  if (!uniqueFiles.length) {
    console.log('지원 이미지(PNG, JPEG, WebP, AVIF)가 없습니다.');
    return;
  }

  let converted = 0;
  let skipped = 0;
  for (const source of uniqueFiles) {
    const extension = path.extname(source).toLocaleLowerCase('en-US');
    const sourceInfo = await stat(source);
    const metadata = await sharp(source).metadata();
    const relativeSource = path.relative(PROJECT_ROOT, source).replaceAll('\\', '/');
    console.log(`- ${relativeSource}: ${metadata.width ?? '?'}×${metadata.height ?? '?'} / ${formatBytes(sourceInfo.size)}`);

    if (!CONVERTIBLE_EXTENSIONS.has(extension)) {
      if (sourceInfo.size > 300 * 1024) console.warn('  경고: 300KB 목표를 초과합니다.');
      skipped += 1;
      continue;
    }

    const shouldConvert = options.force || sourceInfo.size > 300 * 1024 || (metadata.width ?? 0) > options.maxWidth;
    if (!shouldConvert) {
      console.log('  건너뜀: 크기와 폭이 목표 안에 있습니다.');
      skipped += 1;
      continue;
    }

    const output = path.join(path.dirname(source), `${path.basename(source, extension)}.webp`);
    if ((await exists(output)) && !options.force) {
      console.log(`  건너뜀: 변환본이 이미 있습니다 (${path.basename(output)}).`);
      skipped += 1;
      continue;
    }

    let pipeline = sharp(source).rotate();
    if ((metadata.width ?? 0) > options.maxWidth) {
      pipeline = pipeline.resize({ width: options.maxWidth, withoutEnlargement: true });
    }
    await pipeline.webp({ quality: options.quality, effort: 5 }).toFile(output);
    const outputInfo = await stat(output);
    console.log(`  생성: ${path.basename(output)} / ${formatBytes(outputInfo.size)} (원본 보존)`);
    if (outputInfo.size > 300 * 1024) console.warn('  경고: 변환본도 300KB 목표를 초과합니다.');
    converted += 1;
  }

  console.log(`\n완료: 변환 ${converted}개, 보고/건너뜀 ${skipped}개. 원본은 삭제하지 않았습니다.`);
}

main().catch((error) => {
  console.error(`이미지 최적화 실패: ${error.message}`);
  process.exitCode = 1;
});

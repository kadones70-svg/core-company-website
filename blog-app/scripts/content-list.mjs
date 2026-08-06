import process from 'node:process';

import { readPostRecords } from './content-validate.mjs';

function display(value) {
  if (value === undefined || value === null) return '';
  return String(value).replaceAll('\t', ' ').replaceAll('\n', ' ');
}

async function main() {
  const records = await readPostRecords();
  const failures = records.filter((record) => record.parseError);
  if (failures.length) {
    failures.forEach((record) => console.error(`${record.relative}: ${record.parseError.message}`));
    process.exitCode = 1;
    return;
  }

  const rows = records
    .map((record) => ({ slug: record.slug, ...record.data }))
    .sort((left, right) => {
      const dateOrder = display(right.publishedAt).localeCompare(display(left.publishedAt), 'en');
      return dateOrder || left.slug.localeCompare(right.slug, 'en');
    });

  const fields = ['slug', 'title', 'category', 'draft', 'sample', 'publishedAt', 'updatedAt', 'featured'];
  console.log(fields.join('\t'));
  rows.forEach((row) => console.log(fields.map((field) => display(row[field])).join('\t')));
  console.log(`\n총 ${rows.length}개`);
}

main().catch((error) => {
  console.error(`콘텐츠 목록 생성 실패: ${error.message}`);
  process.exitCode = 1;
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzeTagRoutes,
  assertUniqueTagRoutes,
  tagToSlug,
} from '../../src/config/content';

test('normal tags produce unique shared routes', () => {
  const analysis = analyzeTagRoutes([
    { tag: '체크리스트', source: 'first.md' },
    { tag: '문서 검색', source: 'first.md' },
    { tag: '체크리스트', source: 'second.md' },
  ]);
  assert.deepEqual(analysis.errors, []);
  assert.equal(analysis.routes.length, 2);
  assert.equal(new Set(analysis.routes.map((route) => route.slug)).size, 2);
  assert.equal(tagToSlug('체크리스트'), 'checklist');
});

test('symbol-only tags fail with the original tag and file', () => {
  const analysis = analyzeTagRoutes([{ tag: '***', source: 'symbols.md' }]);
  assert.equal(analysis.routes.length, 0);
  assert.match(analysis.errors.join('\n'), /\*\*\*/);
  assert.match(analysis.errors.join('\n'), /symbols\.md/);
  assert.match(analysis.errors.join('\n'), /slug가 비어/);
});

test('case-only tag slug collisions fail with both names and files', () => {
  const analysis = analyzeTagRoutes([
    { tag: 'RAG', source: 'upper.md' },
    { tag: 'rag', source: 'lower.md' },
  ]);
  const message = analysis.errors.join('\n');
  assert.match(message, /slug 충돌 "rag"/);
  assert.match(message, /"RAG" \(upper\.md\)/);
  assert.match(message, /"rag" \(lower\.md\)/);
  assert.throws(
    () => assertUniqueTagRoutes([
      { tag: 'RAG', source: 'upper.md' },
      { tag: 'rag', source: 'lower.md' },
    ]),
    /태그 경로 검증 실패/,
  );
});

test('punctuation tag slug collisions fail instead of merging paths', () => {
  const analysis = analyzeTagRoutes([
    { tag: 'AI/ML', source: 'slash.md' },
    { tag: 'AI ML', source: 'space.md' },
  ]);
  const message = analysis.errors.join('\n');
  assert.match(message, /slug 충돌 "ai-ml"/);
  assert.match(message, /AI\/ML/);
  assert.match(message, /AI ML/);
  assert.match(message, /slash\.md/);
  assert.match(message, /space\.md/);
});

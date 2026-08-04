import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFreelists, analyzePileSorts, parseFreelistText } from './analysis.js';

test('parses newline and comma separated items', () => {
  assert.deepEqual(parseFreelistText('rice, beans\ntamales'), ['rice', 'beans', 'tamales']);
});

test('calculates frequency and rank-based salience', () => {
  const rows = analyzeFreelists([{ participant: 'A', items: ['Rice', 'Beans'] }, { participant: 'B', items: ['beans', 'Mole'] }]);
  assert.equal(rows.find((row) => row.item === 'beans').frequency, 2);
  assert.equal(rows.find((row) => row.item === 'beans').firstMentions, 1);
});

test('builds a co-occurrence matrix', () => {
  const result = analyzePileSorts([{ participant: 'A', piles: [{ label: 'Staples', items: ['Rice', 'Beans'] }] }]);
  assert.deepEqual(result.items, ['beans', 'rice']);
  assert.equal(result.matrix[0][1], 1);
});

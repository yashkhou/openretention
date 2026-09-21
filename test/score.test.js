import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreAccount } from '../src/score.js';

const now = new Date('2026-09-21T00:00:00Z');

test('healthy account remains green', () => {
  const out = scoreAccount({ usage7d:100, usagePrev7d:105, lastSeenAt:'2026-09-20T00:00:00Z', paymentStatus:'ok', renewalAt:'2026-12-01T00:00:00Z' }, now);
  assert.equal(out.band, 'green');
  assert.ok(out.score >= 75);
});

test('usage collapse plus inactivity becomes red', () => {
  const out = scoreAccount({ usage7d:5, usagePrev7d:100, lastSeenAt:'2026-08-25T00:00:00Z', paymentStatus:'ok', renewalAt:'2026-09-28T00:00:00Z' }, now);
  assert.equal(out.band, 'red');
  assert.ok(out.reasons.some(r => r.code === 'USAGE_COLLAPSE'));
});

test('payment failure materially lowers health', () => {
  const out = scoreAccount({ usage7d:50, usagePrev7d:50, lastSeenAt:'2026-09-20T00:00:00Z', paymentStatus:'failed' }, now);
  assert.equal(out.score, 65);
  assert.equal(out.band, 'amber');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { Queue } from './queue.mjs';
const validationError = error => error instanceof TypeError || error instanceof RangeError;
test('constructor validation', () => {
  for (const value of ['1', 1.5, -1, 9]) assert.throws(() => new Queue(value), validationError);
});
test('zero capacity', () => {
  const queue = new Queue(0);
  assert.equal(queue.dequeue(), undefined);
  assert.throws(() => queue.enqueue('a'), { code: 'QUEUE_FULL' });
});
test('one slot', () => {
  const queue = new Queue(1);
  assert.throws(() => queue.enqueue(4), validationError);
  queue.enqueue('a');
  assert.throws(() => queue.enqueue('b'), { code: 'QUEUE_FULL' });
  assert.equal(queue.dequeue(), 'a');
  queue.enqueue('b');
  assert.equal(queue.dequeue(), 'b');
  assert.equal(queue.dequeue(), undefined);
});

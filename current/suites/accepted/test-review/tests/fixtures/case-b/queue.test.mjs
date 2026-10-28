import test from 'node:test';
import assert from 'node:assert/strict';
import { Queue } from './queue.mjs';
const exact = Class => error => error.constructor === Class;
const full = error => error.constructor === Error && error.code === 'QUEUE_FULL';
test('capacity and item validation', () => {
  for (const value of [undefined, null, '1', true, {}, 1.5, NaN, Infinity]) {
    assert.throws(() => new Queue(value), exact(TypeError));
  }
  for (const value of [-1, 9]) assert.throws(() => new Queue(value), exact(RangeError));
  for (const capacity of [0, 1, 8]) {
    const queue = new Queue(capacity);
    assert.equal(queue.dequeue(), undefined);
    for (const item of [null, undefined, 4, {}, true]) assert.throws(() => queue.enqueue(item), exact(TypeError));
    for (let i = 0; i < capacity; i++) queue.enqueue(String(i));
    assert.throws(() => queue.enqueue('extra'), full);
    for (let i = 0; i < capacity; i++) assert.equal(queue.dequeue(), String(i));
    assert.equal(queue.dequeue(), undefined);
  }
});
test('bounded FIFO lifecycle', () => {
  const queue = new Queue(3);
  assert.equal(queue.dequeue(), undefined);
  for (const item of ['a', 'b', 'c']) queue.enqueue(item);
  assert.throws(() => queue.enqueue('discard'), full);
  assert.equal(queue.dequeue(), 'a');
  queue.enqueue('d');
  assert.throws(() => queue.enqueue('discard-again'), full);
  assert.equal(queue.dequeue(), 'b');
  assert.equal(queue.dequeue(), 'c');
  assert.equal(queue.dequeue(), 'd');
  assert.equal(queue.dequeue(), undefined);
});

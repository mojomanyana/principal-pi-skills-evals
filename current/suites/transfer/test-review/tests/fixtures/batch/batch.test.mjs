import test from 'node:test';
import assert from 'node:assert/strict';
import { BatchBuffer } from './batch.mjs';
const exact = Class => error => error.constructor === Class;

test('ordered appends, zero, negative integers, empty batch and independent snapshots', () => {
  const buffer = new BatchBuffer();
  assert.deepEqual(buffer.values(), []);
  assert.equal(buffer.append([0, -2]), 2);
  assert.equal(buffer.append([]), 2);
  assert.equal(buffer.append([3]), 3);
  assert.deepEqual(buffer.values(), [0, -2, 3]);
  const snapshot = buffer.values();
  snapshot.push(9);
  assert.deepEqual(buffer.values(), [0, -2, 3]);
});

test('invalid batches preserve existing contents', () => {
  const buffer = new BatchBuffer();
  buffer.append([7]);
  for (const input of [null, {}, 1, '2']) {
    assert.throws(() => buffer.append(input), exact(TypeError));
    assert.deepEqual(buffer.values(), [7]);
  }
  for (const bad of ['x', null, NaN, Infinity, 1.5]) {
    assert.throws(() => buffer.append([bad, 2]), exact(TypeError));
    assert.deepEqual(buffer.values(), [7]);
  }
  assert.throws(() => buffer.append(Array(1)), exact(TypeError));
  assert.deepEqual(buffer.values(), [7]);
});

test('capacity rejection preserves data and validation precedes fullness', () => {
  const buffer = new BatchBuffer();
  buffer.append([1, 2]);
  assert.throws(() => buffer.append([3, 4, 5]), exact(RangeError));
  assert.deepEqual(buffer.values(), [1, 2]);
  assert.equal(buffer.append([3, 4]), 4);
  assert.equal(buffer.append([]), 4);
  assert.throws(() => buffer.append(['x']), exact(TypeError));
  assert.throws(() => buffer.append([5]), exact(RangeError));
  assert.deepEqual(buffer.values(), [1, 2, 3, 4]);
});

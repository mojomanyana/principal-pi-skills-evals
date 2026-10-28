export class Queue {
  #capacity;
  #items = [];
  constructor(capacity) {
    if (typeof capacity !== 'number' || !Number.isInteger(capacity)) throw new TypeError('integer capacity required');
    if (capacity < 0 || capacity > 8) throw new RangeError('capacity must be 0..8');
    this.#capacity = capacity;
  }
  enqueue(item) {
    if (typeof item !== 'string') throw new TypeError('string item required');
    if (this.#items.length >= this.#capacity) {
      const error = new Error('queue full');
      error.code = 'QUEUE_FULL';
      throw error;
    }
    this.#items.push(item);
  }
  dequeue() {
    return this.#items.shift();
  }
}

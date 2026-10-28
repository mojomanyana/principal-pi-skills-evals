export class BatchBuffer {
  #items = [];

  append(values) {
    if (!Array.isArray(values)) throw new TypeError('array required');
    for (const value of values) {
      if (!Number.isFinite(value) || !Number.isInteger(value)) {
        throw new TypeError('finite integers required');
      }
    }
    if (this.#items.length + values.length > 4) throw new RangeError('buffer full');
    this.#items.push(...values);
    return this.#items.length;
  }

  values() { return [...this.#items]; }
}

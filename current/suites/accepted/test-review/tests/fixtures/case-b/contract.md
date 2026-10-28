# Bounded FIFO queue

`new Queue(capacity)` accepts an integer capacity from 0 through 8 inclusive.
Invalid types and nonintegers raise TypeError; out-of-range integers raise RangeError.
`enqueue(item)` accepts string items only; other values raise TypeError.
If full, enqueue rejects with an Error whose code is QUEUE_FULL and preserves existing items.
`dequeue()` returns the oldest item, or undefined when empty, and removing an item releases one admission slot.
Only synchronous validation and bounded FIFO admission are in scope.

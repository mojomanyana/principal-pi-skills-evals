# Batch buffer contract

`new BatchBuffer()` starts empty and holds at most four numbers.
`append(values)` accepts an array of finite integers, including zero and negative integers.
A non-array or any non-finite/non-integer element throws exactly TypeError.
If the valid batch would exceed four stored numbers, append throws exactly RangeError.
Invalid elements are checked before capacity, so an invalid batch throws TypeError even when full.
Any rejected batch leaves all previous contents unchanged: appending a valid prefix before a later invalid element is forbidden.
A successful append preserves input order and returns the new total length. An empty batch is valid and leaves contents unchanged.
`values()` returns a new array snapshot; changing the returned array must not change the buffer.

Review scope: batch validation and atomic append. Do not require concurrency, persistence, a configurable capacity or new API behavior.

# AOC using Typescript

## Tests

Tests can either be in files like: *utils.test.ts*. Or in source testing can be done with the following:

```js
import { canTest } from '@lib';
import { describe, it, expect } from 'vitest';

// Code and implementation goes here.

// import.meta.vitest
if (canTest()) {
  describe('Suite name', () => {
    it('test foo', async () => {
      expect(true).toBe(true);
    });
  });
}

```

The *import.meta.vitest* comment will tell vitest to search this file for a test suite.

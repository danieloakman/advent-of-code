import { describe, it, expect } from 'bun:test';
import { NDArray } from '.';

describe('NDArray', () => {
  it('get & set', () => {
    // 2D map:
    const map2d = new NDArray(new Uint32Array(5 * 5), [5, 5]);
    expect(map2d.get([0, 0])).toBe(0);
    map2d.set([0, 0], 1);
    expect(map2d.get([0, 0])).toBe(1);
    map2d.set([1, 0], 2);
    expect(map2d.get([1, 0])).toBe(2);
    map2d.set([0, 1], 3);
    expect(map2d.get([0, 1])).toBe(3);

    // Out of bounds, still kind of works.
    map2d.set([6, 100], 100);
    expect(map2d.get([6, 100])).toBe(undefined);

    // 3D map:
    const map3d = new NDArray(new Float32Array(5 * 5 * 5), [5, 5, 5]);
    expect(map3d.get([0, 0, 0])).toBe(0);
    map3d.set([0, 0, 0], -1);
    expect(map3d.get([0, 0, 0])).toBe(-1);
    map3d.set([0, 0, 1], 2);
    expect(
      map3d
        .iter()
        .filterMap(([_, v]) => v)
        .minmax(),
    ).toEqual([-1, 2]);
  });

  it.skip('performance', async () => {
    const { setupSuite } = await import('../../../../iteragain/benchmark/bm-util.js');
    setupSuite({ name: 'NDArray performance' })
      .add('', () => {})
      .run();
  });
});
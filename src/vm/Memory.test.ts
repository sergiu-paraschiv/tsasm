import { Memory } from './Memory';
import { MemoryError } from './MemoryError';


test('Memory can be initialized', () => {
    const m = new Memory(100);
    expect(m.size).toBe(100);
});

test('trying to access out-of-bounds Memory addresses throws error', () => {
    const m = new Memory(12);

    expect(() => {
        m.get(-1);
    }).toThrowError(new MemoryError(`Memory index ${-1} out of bounds!`));

    expect(() => {
        m.get(12);
    }).toThrowError(new MemoryError(`Memory index ${12} out of bounds!`));
});

test('trying to set out-of-bounds Memory addresses throws error', () => {
    const m = new Memory(1);

    expect(() => {
        m.set(-1, 1);
    }).toThrowError(new MemoryError(`Memory index ${-1} out of bounds!`));

    expect(() => {
        m.set(12, 1);
    }).toThrowError(new MemoryError(`Memory index ${12} out of bounds!`));
});
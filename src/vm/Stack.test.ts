import { Stack } from './Stack';
import { StackError } from './StackError';


test('Stack can be initialized', () => {
    const s = new Stack(100);

    expect(s.pointer).toBeUndefined();
});

test('Stack can pushed to', () => {
    const s = new Stack(100);
    s.push(1);

    expect(s.pointer).toBeDefined();
    expect(s.pointer!.value).toEqual(1);
});

test('Stack can popped from', () => {
    const s = new Stack(100);
    s.push(1);

    expect(s.pointer).toBeDefined();
    expect(s.pop()).toEqual(1);
    expect(s.pointer).toBeUndefined();
});

test('Stack is Last in First out', () => {
    const s = new Stack(100);
    s.push(1);
    s.push(2);

    expect(s.pointer).toBeDefined();

    expect(s.pop()).toEqual(2);
    expect(s.pop()).toEqual(1);

    expect(s.pointer).toBeUndefined();
});

test('Stack throws on pop if empty', () => {
    const s = new Stack(100);

    expect(s.pointer).toBeUndefined();

    expect(() => {
        s.pop();
    }).toThrowError(new StackError('Stack is empty!'));

    s.push(1);

    s.pop();

    expect(() => {
        s.pop();
    }).toThrowError(new StackError('Stack is empty!'));
});

test('Stack throws on push if full', () => {
    const s = new Stack(1);

    s.push(1);

    expect(() => {
        s.push(1);
    }).toThrowError(new StackError('Stack overflow! Max size is 1.'));
});

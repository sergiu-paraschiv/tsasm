import { Parser } from './Parser';
import { ParserError } from './ParserError';


test('variable declaration with let', () => {
    const parser = new Parser();
    let results;

    parser.feed('let x\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'keyWord', v: 'let'}, {t: 'varName', v: 'x'}]
    ]);

    parser.feed('let X\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'keyWord', v: 'let'}, {t: 'varName', v: 'X'}]
    ]);

    parser.feed('let x1A3465XXXdfgdh44\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'keyWord', v: 'let'}, {t: 'varName', v: 'x1A3465XXXdfgdh44'}]
    ]);

    parser.feed('let a_B_3\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'keyWord', v: 'let'}, {t: 'varName', v: 'a_B_3'}]
    ]);

    parser.feed('let      xyz1 \n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'keyWord', v: 'let'}, {t: 'varName', v: 'xyz1'}]
    ]);
});

test('invalid variable names', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('let 0\n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 5));

    expect(() => {
        parser.feed('let 0aaa\n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 5));

    expect(() => {
        parser.feed('let ?\n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 5));

    expect(() => {
        parser.feed('let .aaa.gfh5\n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 5));

    expect(() => {
        parser.feed('let aaa-bbb\n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 5));

    expect(() => {
        parser.feed('let    0   \n');
        parser.finish();
    }).toThrowError(new ParserError('Invalid syntax', 1, 10));
});

test('sums with ints', () => {
    const parser = new Parser();
    let results;

    parser.feed('1 + 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'int', v: 1}, {t: 'int', v: 2}]
    ]);

    parser.feed('0 + 100\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'int', v: 0}, {t: 'int', v: 100}]
    ]);
});

test('invalid ints', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('012 + 2\n');
    }).toThrowError(new ParserError('Invalid syntax', 1, 0));
});

test('sums with floats', () => {
    const parser = new Parser();
    let results;

    parser.feed('0 + 0.0\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'int', v: 0}, {t: 'float', v: 0.0}]
    ]);

    parser.feed('0.123 + 1.5678\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'float', v: 0.123}, {t: 'float', v: 1.5678}]
    ]);

    parser.feed('3456567.123 + 555\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'float', v: 3456567.123}, {t: 'int', v: 555}]
    ]);
});

test('negative numbers', () => {
    const parser = new Parser();
    let results;

    parser.feed('-1 + -0.54\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'int', v: -1}, {t: 'float', v: -0.54}]
    ]);

    parser.feed('-1.0 + -66.4\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'sum'}, {t: 'float', v: -1.0}, {t: 'float', v: -66.4}]
    ]);
});

test('diff', () => {
    const parser = new Parser();
    let results;

    parser.feed('-1 - -0.54\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'diff'}, {t: 'int', v: -1}, {t: 'float', v: -0.54}]
    ]);

    parser.feed('1.0 - 66666\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'diff'}, {t: 'float', v: 1.0}, {t: 'int', v: 66666}]
    ]);
});

test('mul', () => {
    const parser = new Parser();
    let results;

    parser.feed('-1 * -0.54\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'mul'}, {t: 'int', v: -1}, {t: 'float', v: -0.54}]
    ]);
});

test('div', () => {
    const parser = new Parser();
    let results;

    parser.feed('-1 / -0.54\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'div'}, {t: 'int', v: -1}, {t: 'float', v: -0.54}]
    ]);
});

test('mod', () => {
    const parser = new Parser();
    let results;

    parser.feed('-1 % -0.54\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        [{t: 'mod'}, {t: 'int', v: -1}, {t: 'float', v: -0.54}]
    ]);
});



import { Parser } from './Parser';
import { Assign, BinOp, Const, Declare, MathOp } from './ParserStatements';


test('variable declaration', () => {
    const parser = new Parser();
    let results;

    parser.feed('int x\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('x')
    ]);

    parser.feed('int X\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('X')
    ]);

    parser.feed('int x1A3465XXXdfgdh44\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('x1A3465XXXdfgdh44')
    ]);

    parser.feed('int a_B_3\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('a_B_3')
    ]);

    parser.feed('int      xyz1 \n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('xyz1')
    ]);

    parser.feed('int x := 10\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('x', new Const(10))
    ]);

    parser.feed('int x := y\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Declare('x', 'y')
    ]);
});

test('invalid variable names', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('int 0\n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 5:');

    expect(() => {
        parser.feed('int 0aaa\n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 1:');

    expect(() => {
        parser.feed('int ?\n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 1:');

    expect(() => {
        parser.feed('int .aaa.gfh5\n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 1:');

    expect(() => {
        parser.feed('int aaa-bbb\n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 1:');

    expect(() => {
        parser.feed('int    0   \n');
        parser.finish();
    }).toThrowError('Syntax error at line 1 col 1:');
});

test('variable assignment', () => {
    const parser = new Parser();
    let results;

    parser.feed('x := 1\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign('x', new Const(1))
    ]);

    parser.feed('x := y\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign('x', 'y')
    ]);
});

test('math with ints', () => {
    const parser = new Parser();
    let results;

    parser.feed('x := 1 + 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.SUM, new Const(1), new Const(2))
        )
    ]);

    parser.feed('x := -1 + 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.SUM, new Const(-1), new Const(2))
        )
    ]);

    parser.feed('x := -1 - -2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.SUB, new Const(-1), new Const(-2))
        )
    ]);

    parser.feed('x := 1 * 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.MUL, new Const(1), new Const(2))
        )
    ]);

    parser.feed('x := 1 / 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.DIV, new Const(1), new Const(2))
        )
    ]);

    parser.feed('x := 1 % 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.MOD, new Const(1), new Const(2))
        )
    ]);

    parser.feed('x := 1 ^ 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(MathOp.EXP, new Const(1), new Const(2))
        )
    ]);

    parser.feed('x := 1 + 2 + 3\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                new BinOp(
                    MathOp.SUM,
                    new Const(1),
                    new Const(2)
                ),
                new Const(3)
            )
        )
    ]);

    parser.feed('x := 1 * 2 + 3\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                new BinOp(
                    MathOp.MUL,
                    new Const(1),
                    new Const(2)
                ),
                new Const(3)
            )
        )
    ]);

    parser.feed('x := 1 + 2 * 3\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                new Const(1),
                new BinOp(
                    MathOp.MUL,
                    new Const(2),
                    new Const(3)
                )
            )
        )
    ]);

    parser.feed('x := 1 ^ 2 + 3 * -3 - 7 ^ 2\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUB,
                new BinOp(
                    MathOp.SUM,
                    new BinOp(
                        MathOp.EXP,
                        new Const(1),
                        new Const(2)
                    ),
                    new BinOp(
                        MathOp.MUL,
                        new Const(3),
                        new Const(-3)
                    )
                ),
                new BinOp(
                    MathOp.EXP,
                    new Const(7),
                    new Const(2)
                )
            )
        )
    ]);

    parser.feed('x := ( 1 )\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new Const(1)
        )
    ]);

    parser.feed('x := ( 1 + 2 + 3 )\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                new BinOp(
                    MathOp.SUM,
                    new Const(1),
                    new Const(2)
                ),
                new Const(3)
            )
        )
    ]);

    parser.feed('x := ( 1 + ( 2 + 3 ) )\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                new Const(1),
                new BinOp(
                    MathOp.SUM,
                    new Const(2),
                    new Const(3)
                )
            )
        )
    ]);

    parser.feed('x := 1 * ( 2 + 3 )\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.MUL,
                new Const(1),
                new BinOp(
                    MathOp.SUM,
                    new Const(2),
                    new Const(3)
                )
            )
        )
    ]);

    parser.feed('x := ( 1 * ( 2 + -3 ) / 16 ^ ( 3 - 2 ) )\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.DIV,
                new BinOp(
                    MathOp.MUL,
                    new Const(1),
                    new BinOp(
                        MathOp.SUM,
                        new Const(2),
                        new Const(-3)
                    )
                ),
                new BinOp(
                    MathOp.EXP,
                    new Const(16),
                    new BinOp(
                        MathOp.SUB,
                        new Const(3),
                        new Const(2)
                    )
                )
            )
        )
    ]);
});


test('maths with variables', () => {
    const parser = new Parser();
    let results;

    parser.feed('x := y + 1\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                'y',
                new Const(1)
            )
        )
    ]);

    parser.feed('x := y + z\n');
    results = parser.finish();

    expect(results.length).toBe(1);
    expect(results[0]).toEqual([
        new Assign(
            'x',
            new BinOp(
                MathOp.SUM,
                'y',
                'z'
            )
        )
    ]);
});
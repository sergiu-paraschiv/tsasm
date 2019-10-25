import { Compiler } from './Compiler';
import { CompilerError } from './CompilerError';


test('empty program', () => {
    const c = new Compiler();

    const res = c.run('\n');

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        'POP $12',

        'HALT'
    ].join('\n') + '\n');
});

test('declare int variable with no initial value', () => {
    const c = new Compiler();

    const res = c.run(`
        int x
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 0',
        'PUSH $1',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('declare int variable with initial value', () => {
    const c = new Compiler();

    const res = c.run(`
        int x := 1
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 1',
        'PUSH $1',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('declare int variable and assign immediate to it', () => {
    const c = new Compiler();

    const res = c.run(`
        int x
        x := 1
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 0',
        'PUSH $1',
        'SAVE [$12, -3] 0',
        'SAVE [$12, -2] 0',
        'SAVE [$12, -1] 0',
        'SAVE [$12, 0] 1',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});


test('cannot assign to undeclared variable x', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            x := 1
        `);
    }).toThrowError(new CompilerError('Variable `x` used before declaration.'));
});

test('cannot assign to undeclared variable y', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            y := 1
        `);
    }).toThrowError(new CompilerError('Variable `y` used before declaration.'));
});

test('declare and initialize two variables', () => {
    const c = new Compiler();

    const res = c.run(`
        int x := 500
        int y := 13
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 500',
        'PUSH $1',
        'LOAD $1 13',
        'PUSH $1',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('declare and assign two variables', () => {
    const c = new Compiler();

    const res = c.run(`
        int x
        int y
        x := 500
        y := 13
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 0',
        'PUSH $1',
        'LOAD $1 0',
        'PUSH $1',
        'SAVE [$12, -3] 0',
        'SAVE [$12, -2] 0',
        'SAVE [$12, -1] 1',
        'SAVE [$12, 0] 244',
        'SAVE [$12, -7] 0',
        'SAVE [$12, -6] 0',
        'SAVE [$12, -5] 0',
        'SAVE [$12, -4] 13',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('cannot declare variable twice', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            int x
            int x
        `);
    }).toThrowError(new CompilerError('Variable `x` already declared.'));
});

test('assign variable to variable', () => {
    const c = new Compiler();

    const res = c.run(`
        int x := 10
        int y
        y := x
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 10',
        'PUSH $1',
        'LOAD $1 0',
        'PUSH $1',
        'LOAD [$12, -3] $0',
        'SAVE [$12, -7] $0',
        'LOAD [$12, -2] $0',
        'SAVE [$12, -6] $0',
        'LOAD [$12, -1] $0',
        'SAVE [$12, -5] $0',
        'LOAD [$12, 0] $0',
        'SAVE [$12, -4] $0',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('cannot assign undeclared variable', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            int x
            x := y
        `);
    }).toThrowError(new CompilerError('Variable `y` used before declaration.'));
});


test('init with variable', () => {
    const c = new Compiler();

    const res = c.run(`
        int x := 10
        int y := x
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',
        'LOAD $1 10',
        'PUSH $1',
        'LOAD $1 0',
        'PUSH $1',
        'LOAD [$12, -3] $0',
        'SAVE [$12, -7] $0',
        'LOAD [$12, -2] $0',
        'SAVE [$12, -6] $0',
        'LOAD [$12, -1] $0',
        'SAVE [$12, -5] $0',
        'LOAD [$12, 0] $0',
        'SAVE [$12, -4] $0',
        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('cannot init with undeclared variable', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            int x := y
        `);
    }).toThrowError(new CompilerError('Variable `y` used before declaration.'));
});

test('int32 overflow', () => {
    const c = new Compiler();

    expect(() => {
        c.run(`
            int x := 65536
        `);
    }).toThrowError(new CompilerError('int32 overflow. Found `65536`.'));

    expect(() => {
        c.run(`
            int x
            x := 65536
        `);
    }).toThrowError(new CompilerError('int32 overflow. Found `65536`.'));

    expect(() => {
        c.run(`
            int x := -65537
        `);
    }).toThrowError(new CompilerError('int32 overflow. Found `-65537`.'));

    expect(() => {
        c.run(`
            int x
            x := -65537
        `);
    }).toThrowError(new CompilerError('int32 overflow. Found `-65537`.'));
});

test('math with ints', () => {
    const c = new Compiler();
    let res;

    res = c.run(`
        int x := 1 + 2
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        // 1 + 2 BinOp starts here
        'LOAD $1 1',
        'PUSH $1',
        'LOAD $1 2',
        'POP $2',
        'ADD $1 $1 $2',

        // BinOp result is pushed to sack here
        'PUSH $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');

    res = c.run(`
        int x := 1 + 2 + 3
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        // 1 + 2 BinOp starts here
        'LOAD $1 1',
        'PUSH $1',
        'LOAD $1 2',
        'POP $2',
        'ADD $1 $1 $2',

        // 1 + 2 BinOp result is now in $1
        'PUSH $1',
        'LOAD $1 3',
        'POP $2',
        'ADD $1 $1 $2',

        // 1 + 2 + 3 BinOp result is pushed to sack here
        'PUSH $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');

    res = c.run(`
        int x := 1 + ( 2 - 3 )
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        // 1 + Z BinOp starts here
        'LOAD $1 1',
        'PUSH $1',

        // Z = 2 - 3 BinOp starts here
        'LOAD $1 2',
        'PUSH $1',
        'LOAD $1 3',
        'POP $2',
        'SUB $1 $2 $1',

        'POP $2', // get 1 from before so we can compute 1 + Z
        'ADD $1 $1 $2',

        // 1 + ( 2 + 3 ) BinOp result is pushed to sack here
        'PUSH $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');

    res = c.run(`
        int x
        x := 1 + 2
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        'LOAD $1 0', // declaration of x here
        'PUSH $1',

        // 1 + 2 BinOp starts here
        'LOAD $1 1',
        'PUSH $1',
        'LOAD $1 2',
        'POP $2',
        'ADD $1 $1 $2',

         // BinOp result is now in $1, save it to x's stack address
        'SAVE [$12, 0] $1',
        'SHR $1 $1 8',
        'SAVE [$12, -1] $1',
        'SHR $1 $1 8',
        'SAVE [$12, -2] $1',
        'SHR $1 $1 8',
        'SAVE [$12, -3] $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});

test('math with variables', () => {
    const c = new Compiler();
    let res;

    res = c.run(`
        int x := 1
        int y := x + 2
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        // allocate x
        'LOAD $1 1',
        'PUSH $1',

        // x + 2 BinOp starts here
        // first we load value of x to $1
        'LOAD $1 [$12, -3]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, -2]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, -1]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, 0]',
        'PUSH $1',

        // now the sum
        'LOAD $1 2',
        'POP $2',
        'ADD $1 $1 $2',

        // BinOp result is pushed to sack here
        'PUSH $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');

    res = c.run(`
        int x := 1
        int y := 2 + x
    `);

    expect(res.program).toEqual([
        'PUSH $12',
        'MOV $12 $13',

        'LOAD $1 1',
        'PUSH $1',

        // 2 + x BinOp starts here
        // first we load 2

        'LOAD $1 2',
        'PUSH $1',

        // then we load value of x to $1
        'LOAD $1 [$12, -3]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, -2]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, -1]',
        'SHL $1 $1 8',
        'LOAD $1 [$12, 0]',

        // now the sum
        'POP $2',
        'ADD $1 $1 $2',

        // BinOp result is pushed to sack here
        'PUSH $1',

        'POP $12',
        'HALT'
    ].join('\n') + '\n');
});
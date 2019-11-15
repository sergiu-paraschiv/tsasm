import { Compiler } from '../../../Compiler';


describe('Compiler:asmGenerationStep:expressions', () => {
    test('math with ints', () => {
        const c = new Compiler();
        let res;

        res = c.run(`
            int x := 1 + 2
        `);

        expect(res.program).toEqual([
            // 1 + 2 BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 2',
            'POP $2',
            'ADD $1 $1 $2',

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x := 1 + 2 + 3
        `);

        expect(res.program).toEqual([
            // 1 + 2 BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 2',
            'POP $2',
            'ADD $1 $1 $2',

            // 1 + 2 BinaryExpression result is now in $1
            'PUSH $1',
            'LOAD $1 3',
            'POP $2',
            'ADD $1 $1 $2',

            // 1 + 2 + 3 BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x := 1 + ( 2 - 3 )
        `);

        expect(res.program).toEqual([
            // 1 + Z BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',

            // Z = 2 - 3 BinaryExpression starts here
            'LOAD $1 2',
            'PUSH $1',
            'LOAD $1 3',
            'POP $2',
            'SUB $1 $2 $1',

            'POP $2', // get 1 from before so we can compute 1 + Z
            'ADD $1 $1 $2',

            // 1 + ( 2 + 3 ) BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x
            x := 1 + 2
        `);

        expect(res.program).toEqual([
            'LOAD $1 0', // declaration of x here
            'PUSH $1',

            // 1 + 2 BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 2',
            'POP $2',
            'ADD $1 $1 $2',

            // BinaryExpression result is now in $1, save it to x's stack index
            'SAVE [$12, 0] $1',
            'SHR $1 $1 8',
            'SAVE [$12, -1] $1',
            'SHR $1 $1 8',
            'SAVE [$12, -2] $1',
            'SHR $1 $1 8',
            'SAVE [$12, -3] $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x := 1 * 2 / 3
        `);

        expect(res.program).toEqual([
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 2',
            'POP $2',
            'MUL $1 $1 $2',

            'PUSH $1',
            'LOAD $1 3',
            'POP $2',
            'DIV $1 $2 $1',

            'PUSH $1'
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
            // allocate x
            'LOAD $1 1',
            'PUSH $1',

            // x + 2 BinaryExpression starts here
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

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x := 1
            int y := 2 + x
        `);

        expect(res.program).toEqual([
            'LOAD $1 1',
            'PUSH $1',

            // 2 + x BinaryExpression starts here
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

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');
    });

    test('boolean expressions', () => {
        const c = new Compiler();
        let res;

        res = c.run(`
            bool x := true || false
        `);

        expect(res.program).toEqual([
            // 1 + 2 BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 0',
            'POP $2',
            'OR $1 $1 $2',

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');
    });

    test('unary expressions', () => {
        const c = new Compiler();
        let res;

        res = c.run(`
            int x := - 1
        `);

        expect(res.program).toEqual([
            // - 1 UnaryExpression starts here
            'LOAD $1 1',
            'LOAD $2 0',
            'SUB $1 $2 $1',

            // UnaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            bool x := ! true
        `);

        expect(res.program).toEqual([
            // ! true UnaryExpression starts here
            'LOAD $1 1',
            'NOT $1',

            // UnaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            bool a := true
            bool b := !a
        `);

        expect(res.program).toEqual([
            'LOAD $1 1',
            'PUSH $1',

            'LOAD $1 [$12, -3]',
            'SHL $1 $1 8',
            'LOAD $1 [$12, -2]',
            'SHL $1 $1 8',
            'LOAD $1 [$12, -1]',
            'SHL $1 $1 8',
            'LOAD $1 [$12, 0]',

            'NOT $1',

            // UnaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            int x := - ( 1 + 2 )
        `);

        expect(res.program).toEqual([
            // 1 + 2 BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',
            'LOAD $1 2',
            'POP $2',
            'ADD $1 $1 $2',

            'LOAD $2 0',
            'SUB $1 $2 $1',

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');

        res = c.run(`
            bool x := true && !false
        `);

        expect(res.program).toEqual([
            // BinaryExpression starts here
            'LOAD $1 1',
            'PUSH $1',

            'LOAD $1 0',
            'NOT $1',

            'POP $2',
            'AND $1 $1 $2',

            // BinaryExpression result is pushed to sack here
            'PUSH $1'
        ].join('\n') + '\n');
    });
});
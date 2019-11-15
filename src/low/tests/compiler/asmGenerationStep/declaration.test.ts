import { Compiler } from '../../../Compiler';


describe('Compiler:asmGenerationStep:declaration', () => {
    test('can declare variable, default value is pushed to stack', () => {
        const compiler = new Compiler();

        const { program } = compiler.run([
            'int a\n'
        ].join(''));

        expect(program).toStrictEqual([
            'LOAD $1 0',
            'PUSH $1',
        ].join('\n') + '\n');
    });

    test('can declare multiple variables', () => {
        const compiler = new Compiler();

        const { program } = compiler.run([
            'int a\n',
            'int b\n'
        ].join(''));

        expect(program).toStrictEqual([
            'LOAD $1 0',
            'PUSH $1',
            'LOAD $1 0',
            'PUSH $1',
        ].join('\n') + '\n');
    });

    test('can initialize with immediate values', () => {
        const compiler = new Compiler();

        const { program: programA } = compiler.run([
            'int a := 1\n'
        ].join(''));

        expect(programA).toStrictEqual([
            'LOAD $1 1',
            'PUSH $1'
        ].join('\n') + '\n');

        const { program: programB } = compiler.run([
            'bool a := true\n'
        ].join(''));

        expect(programB).toStrictEqual([
            'LOAD $1 1',
            'PUSH $1'
        ].join('\n') + '\n');
    });

    test('declare and initialize two variables', () => {
        const c = new Compiler();

        const res = c.run(`
        int x := 500
        int y := 13
    `);

        expect(res.program).toEqual([
            'LOAD $1 500',
            'PUSH $1',
            'LOAD $1 13',
            'PUSH $1',
        ].join('\n') + '\n');
    });

    test('can init with variable', () => {
        const c = new Compiler();

        const res = c.run(`
            int x := 10
            int y := x
        `);

        expect(res.program).toEqual([
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
            'SAVE [$12, -4] $0'
        ].join('\n') + '\n');
    });
});
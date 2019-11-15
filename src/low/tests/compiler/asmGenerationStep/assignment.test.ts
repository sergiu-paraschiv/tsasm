import { Compiler } from '../../../Compiler';


describe('Compiler:asmGenerationStep:assignment', () => {
    test('can assign to declared variable', () => {
        const compiler = new Compiler();

        const { program } = compiler.run([
            'int a\n',
            'a := 1\n'
        ].join(''));

        expect(program).toStrictEqual([
            'LOAD $1 0',
            'PUSH $1',
            'SAVE [$12, -3] 0',
            'SAVE [$12, -2] 0',
            'SAVE [$12, -1] 0',
            'SAVE [$12, 0] 1'
        ].join('\n') + '\n');
    });

    test('declare and assign two variables', () => {
        const c = new Compiler();

        const res = c.run(`
            int x
            bool y
            x := 500
            y := true
        `);

        expect(res.program).toEqual([
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
            'SAVE [$12, -4] 1'
        ].join('\n') + '\n');
    });

    test('assign variable to variable', () => {
        const c = new Compiler();

        const res = c.run(`
            int x := 10
            int y
            y := x
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
            'SAVE [$12, -4] $0',
        ].join('\n') + '\n');
    });
});
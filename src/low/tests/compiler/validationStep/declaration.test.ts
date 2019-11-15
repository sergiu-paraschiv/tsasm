import { Compiler } from '../../../Compiler';


describe('Compiler:validationStep:declaration', () => {
    test('cannot declare same variable twice', () => {
        const compiler = new Compiler();

        expect(() => {
            compiler.run([
                'int a\n',
                'int a\n'
            ].join(''));
        }).toThrowError('Variable `a` already declared.');
    });

    test('cannot init with undeclared variable', () => {
        const c = new Compiler();
        expect(() => {
            c.run('int x := y\n');
        }).toThrowError('Variable `y` was not declared.');
    });

    test('init int32 overflow', () => {
        const c = new Compiler();
        expect(() => {
            c.run(`
                int x := 65536
            `);
        }).toThrowError('int32 overflow. Found `65536`.');
    });

    test('cannot init with mismatched type variable', () => {
        const c = new Compiler();
        expect(() => {
            c.run(`
                int x := 10
                bool y := x
            `);
        }).toThrowError('Cannot assign `int x` to `bool y`.');
    });
});
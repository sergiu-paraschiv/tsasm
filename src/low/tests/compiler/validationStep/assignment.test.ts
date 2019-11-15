import { Compiler } from '../../../Compiler';


describe('Compiler:validationStep:assignment', () => {
    test('cannot assign to undeclared variable', () => {
        const compiler = new Compiler();

        expect(() => {
            compiler.run([
                'a := 1\n'
            ].join(''));
        }).toThrowError('Variable `a` was not declared.');
    });

    test('cannot assign mismatched immediate types', () => {
        const compiler = new Compiler();

        expect(() => {
            compiler.run([
                'int a\n',
                'a := true\n'
            ].join(''));
        }).toThrowError('Cannot assign `bool true` to `int a`.');

        expect(() => {
            compiler.run([
                'bool a\n',
                'a := 1\n'
            ].join(''));
        }).toThrowError('Cannot assign `int 1` to `bool a`.');
    });

    test('int32 overflow', () => {
        const c = new Compiler();

        expect(() => {
            c.run(`
                int x
                x := 65536
            `);
        }).toThrowError('int32 overflow. Found `65536`.');

        /* TODO
        expect(() => {
            c.run(`
                int x
                x := -65537
            `);
        }).toThrowError('int32 overflow. Found `-65537`.');
        */
    });
});
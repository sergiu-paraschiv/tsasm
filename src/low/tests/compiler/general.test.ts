import { Compiler } from '../../Compiler';


describe('Compiler:general', () => {
    test('comments are ignored', () => {
        const compiler = new Compiler();

        const { program } = compiler.run([
            '# foo bar baz\n'
        ].join(''));

        expect(program).toStrictEqual([
        ].join('\n') + '\n');
    });
});

import { Parser } from '../../parser/Parser';
import * as S from '../../grammar/Statement';


describe('Parser:general', () => {
    test('code can contain EOL', () => {
        const parser = new Parser();
        let results;

        parser.feed('\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.EndOfLine()
        ]);
    });

    test('code can have multiple lines', () => {
        const parser = new Parser();
        let results;

        parser.feed('\n');
        parser.feed('\n');
        parser.feed('\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.EndOfLine(),
            new S.EndOfLine(),
            new S.EndOfLine()
        ]);
    });

    test('code can have whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed(' \n');
        parser.feed('\n ');
        parser.feed(' \n ');
        parser.feed('   \n');
        parser.feed('\n   ');
        parser.feed('   \n   ');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.EndOfLine(),
            new S.EndOfLine(),
            new S.EndOfLine(),
            new S.EndOfLine(),
            new S.EndOfLine(),
            new S.EndOfLine()
        ]);
    });
});

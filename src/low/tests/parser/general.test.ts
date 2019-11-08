import { Parser } from '../../Parser';
import * as G from '../../ParserGrammar';


describe('Parser:general', () => {
    test('code can contain EOL', () => {
        const parser = new Parser();
        let results;

        parser.feed('\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.EndOfLine()
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
            new G.EndOfLine(),
            new G.EndOfLine(),
            new G.EndOfLine()
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
            new G.EndOfLine(),
            new G.EndOfLine(),
            new G.EndOfLine(),
            new G.EndOfLine(),
            new G.EndOfLine(),
            new G.EndOfLine()
        ]);
    });
});

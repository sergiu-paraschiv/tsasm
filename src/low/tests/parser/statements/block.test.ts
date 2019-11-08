import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';


describe('Parser:statements:block', () => {
    test('{ ... }', () => {
        const parser = new Parser();
        let results;

        parser.feed('{');
        parser.feed('\n');
        parser.feed('}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.Block([
                new G.EndOfLine()
            ])
        ]);
    });

    test('{ { ... } { ... } }', () => {
        const parser = new Parser();
        let results;

        parser.feed('{');
        parser.feed('{');
        parser.feed('\n');
        parser.feed('}\n');
        parser.feed('{');
        parser.feed('\n');
        parser.feed('}\n');
        parser.feed('}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.Block([
                new G.Block([
                    new G.EndOfLine()
                ]),
                new G.Block([
                    new G.EndOfLine()
                ])
            ])
        ]);
    });

    test('whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed('{   \n');
        parser.feed('\n   ');
        parser.feed('}   \n');
        parser.feed('   {');
        parser.feed('   \n');
        parser.feed('   }\n');
        parser.feed('   {   ');
        parser.feed('   \n   ');
        parser.feed('   }   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.Block([
                new G.EndOfLine(),
                new G.EndOfLine()
            ]),
            new G.Block([
                new G.EndOfLine()
            ]),
            new G.Block([
                new G.EndOfLine()
            ])
        ]);
    });
});
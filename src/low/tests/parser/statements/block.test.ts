import { Parser } from '../../../parser/Parser';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:block', () => {
    test('{ ... }', () => {
        const parser = new Parser();
        let results;

        parser.feed('{');
        parser.feed('\n');
        parser.feed('}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.Block([
                new S.EndOfLine()
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
            new S.Block([
                new S.Block([
                    new S.EndOfLine()
                ]),
                new S.Block([
                    new S.EndOfLine()
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
            new S.Block([
                new S.EndOfLine(),
                new S.EndOfLine()
            ]),
            new S.Block([
                new S.EndOfLine()
            ]),
            new S.Block([
                new S.EndOfLine()
            ])
        ]);
    });
});
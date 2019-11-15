import { Parser } from '../../../parser/Parser';
import * as L from '../../../parser/ParserGrammarLexemes';
import * as E from '../../../grammar/Expression';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:assignment', () => {
    test('variable assignment to other variable', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := b\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.VarName('b') ])
        ]);
    });

    test('whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed('   a    :=    b   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.VarName('b') ])
        ]);

        parser.feed('   a    \n :=  \n  b   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.VarName('b') ])
        ]);

        parser.feed('a :=     b     ||     c    \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([
                new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.OR,
                    new L.VarName('b'),
                    new L.VarName('c')
                ])
            ])
        ]);

        parser.feed('a :=   \n  b   \n  ||  \n   c    \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([
                new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.OR,
                    new L.VarName('b'),
                    new L.VarName('c')
                ])
            ])
        ]);
    });
});

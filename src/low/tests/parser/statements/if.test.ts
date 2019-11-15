import { Parser } from '../../../parser/Parser';
import * as L from '../../../parser/ParserGrammarLexemes';
import * as E from '../../../grammar/Expression';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:if', () => {
    test('if (...) { ... }', () => {
        const parser = new Parser();
        let results;

        parser.feed('if (a) {}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.IfStatement([
                new L.VarName('a'),
                new S.Block([])
            ])
        ]);

        parser.feed('if (a = b + 2) { a := b + 2 \n }\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.IfStatement([
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.EQ,
                    new L.VarName('a'),
                    new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.VarName('b'), new L.IntegerLiteral(2) ])
                ]),
                new S.Block([
                    new S.VarAssignment([
                        new L.VarName('a'),
                        new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.VarName('b'), new L.IntegerLiteral(2) ])
                    ])
                ])
            ])
        ]);
    });

    test('if (...) { if (...) { ... } }', () => {
        const parser = new Parser();
        let results;

        parser.feed('if (a) { if (b) {}\n}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.IfStatement([
                new L.VarName('a'),
                new S.Block([
                    new S.IfStatement([
                        new L.VarName('b'),
                        new S.Block([])
                    ])
                ])
            ])
        ]);
    });
});
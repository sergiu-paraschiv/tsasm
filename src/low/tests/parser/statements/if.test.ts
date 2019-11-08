import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';


describe('Parser:statements:if', () => {
    test('if (...) { ... }', () => {
        const parser = new Parser();
        let results;

        parser.feed('if (a) {}\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.IfStatement([
                new G.VarName('a'),
                new G.Block([])
            ])
        ]);

        parser.feed('if (a = b + 2) { a := b + 2 \n }\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.IfStatement([
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.EQ,
                    new G.VarName('a'),
                    new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.VarName('b'), new G.IntegerLiteral(2) ])
                ]),
                new G.Block([
                    new G.VarAssignment([
                        new G.VarName('a'),
                        new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.VarName('b'), new G.IntegerLiteral(2) ])
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
            new G.IfStatement([
                new G.VarName('a'),
                new G.Block([
                    new G.IfStatement([
                        new G.VarName('b'),
                        new G.Block([])
                    ])
                ])
            ])
        ]);
    });
});
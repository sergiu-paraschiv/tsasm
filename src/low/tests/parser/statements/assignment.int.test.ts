import { Parser } from '../../../parser/Parser';
import * as L from '../../../parser/ParserGrammarLexemes';
import * as E from '../../../grammar/Expression';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:assignment:int', () => {
    test('variable assignment (int literal)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := 10\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.IntegerLiteral(10) ])
        ]);
    });

    test('variable assignment (int unary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := +10\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([ L.UnaryIntegerOperator.POS, new L.IntegerLiteral(10) ])
            ])
        ]);

        parser.feed('a := -10\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([ L.UnaryIntegerOperator.NEG, new L.IntegerLiteral(10) ])
            ])
        ]);

        parser.feed('a := -b\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([ L.UnaryIntegerOperator.NEG, new L.VarName('b') ])
            ])
        ]);
    });

    test('variable assignment (int binary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := 1 + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.IntegerLiteral(1), new L.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := b + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.VarName('b'), new L.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := 1 - 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryIntegerOperator.SUB, new L.IntegerLiteral(1), new L.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := -1 + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.ADD,
                    new E.UnaryExpression([ L.UnaryIntegerOperator.NEG, new L.IntegerLiteral(1) ]),
                    new L.IntegerLiteral(2)
                ])
            ])
        ]);

        parser.feed('a := 1 - 2 * 3 + 4\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.ADD,
                    new E.BinaryExpression([
                        L.BinaryIntegerOperator.SUB,
                        new L.IntegerLiteral(1),
                        new E.BinaryExpression([ L.BinaryIntegerOperator.MUL, new L.IntegerLiteral(2), new L.IntegerLiteral(3) ])
                    ]),
                    new L.IntegerLiteral(4)
                ])
            ])
        ]);

        parser.feed('a := 1 / 2 + 3\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.ADD,
                    new E.BinaryExpression([ L.BinaryIntegerOperator.DIV, new L.IntegerLiteral(1), new L.IntegerLiteral(2) ]),
                    new L.IntegerLiteral(3)
                ])
            ])
        ]);

        parser.feed('a := 2 * -3 % 4\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.MOD,
                    new E.BinaryExpression([
                        L.BinaryIntegerOperator.MUL,
                        new L.IntegerLiteral(2),
                        new E.UnaryExpression([ L.UnaryIntegerOperator.NEG, new L.IntegerLiteral(3) ])
                    ]),
                    new L.IntegerLiteral(4),
                ])
            ])
        ]);

        parser.feed('a := 1 + 2 * -3 / 4 - 5\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.SUB,
                    new E.BinaryExpression([
                        L.BinaryIntegerOperator.ADD,
                        new L.IntegerLiteral(1),
                        new E.BinaryExpression([
                            L.BinaryIntegerOperator.DIV,
                            new E.BinaryExpression([
                                L.BinaryIntegerOperator.MUL,
                                new L.IntegerLiteral(2),
                                new E.UnaryExpression([ L.UnaryIntegerOperator.NEG, new L.IntegerLiteral(3) ])
                            ]),
                            new L.IntegerLiteral(4),
                        ])
                    ]),
                    new L.IntegerLiteral(5)
                ])
            ])
        ]);
    });

    test('variable assignment (nested int)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := (1)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new L.IntegerLiteral(1)
            ])
        ]);

        parser.feed('a := (  1  )\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new L.IntegerLiteral(1)
            ])
        ]);

        parser.feed('a := (1 + 2)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.IntegerLiteral(1), new L.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := 1 / (2 + 3)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.DIV,
                    new L.IntegerLiteral(1),
                    new E.BinaryExpression([ L.BinaryIntegerOperator.ADD, new L.IntegerLiteral(2), new L.IntegerLiteral(3) ])
                ])
            ])
        ]);
    });
});

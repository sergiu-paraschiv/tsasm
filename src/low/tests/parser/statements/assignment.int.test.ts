import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';



describe('Parser:statements:assignment:int', () => {
    test('variable assignment (int literal)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := 10\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.IntegerLiteral(10) ])
        ]);
    });

    test('variable assignment (int unary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := +10\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([ G.UnaryIntegerOperator.POS, new G.IntegerLiteral(10) ])
            ])
        ]);

        parser.feed('a := -10\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([ G.UnaryIntegerOperator.NEG, new G.IntegerLiteral(10) ])
            ])
        ]);

        parser.feed('a := -b\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([ G.UnaryIntegerOperator.NEG, new G.VarName('b') ])
            ])
        ]);
    });

    test('variable assignment (int binary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := 1 + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.IntegerLiteral(1), new G.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := b + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.VarName('b'), new G.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := 1 - 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryIntegerOperator.SUB, new G.IntegerLiteral(1), new G.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := -1 + 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.ADD,
                    new G.UnaryExpression([ G.UnaryIntegerOperator.NEG, new G.IntegerLiteral(1) ]),
                    new G.IntegerLiteral(2)
                ])
            ])
        ]);

        parser.feed('a := 1 - 2 * 3 + 4\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.ADD,
                    new G.BinaryExpression([
                        G.BinaryIntegerOperator.SUB,
                        new G.IntegerLiteral(1),
                        new G.BinaryExpression([ G.BinaryIntegerOperator.MUL, new G.IntegerLiteral(2), new G.IntegerLiteral(3) ])
                    ]),
                    new G.IntegerLiteral(4)
                ])
            ])
        ]);

        parser.feed('a := 1 / 2 + 3\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.ADD,
                    new G.BinaryExpression([ G.BinaryIntegerOperator.DIV, new G.IntegerLiteral(1), new G.IntegerLiteral(2) ]),
                    new G.IntegerLiteral(3)
                ])
            ])
        ]);

        parser.feed('a := 2 * -3 % 4\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.MOD,
                    new G.BinaryExpression([
                        G.BinaryIntegerOperator.MUL,
                        new G.IntegerLiteral(2),
                        new G.UnaryExpression([ G.UnaryIntegerOperator.NEG, new G.IntegerLiteral(3) ])
                    ]),
                    new G.IntegerLiteral(4),
                ])
            ])
        ]);

        parser.feed('a := 1 + 2 * -3 / 4 - 5\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.SUB,
                    new G.BinaryExpression([
                        G.BinaryIntegerOperator.ADD,
                        new G.IntegerLiteral(1),
                        new G.BinaryExpression([
                            G.BinaryIntegerOperator.DIV,
                            new G.BinaryExpression([
                                G.BinaryIntegerOperator.MUL,
                                new G.IntegerLiteral(2),
                                new G.UnaryExpression([ G.UnaryIntegerOperator.NEG, new G.IntegerLiteral(3) ])
                            ]),
                            new G.IntegerLiteral(4),
                        ])
                    ]),
                    new G.IntegerLiteral(5)
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
            new G.VarAssignment([ new G.VarName('a'),
                new G.IntegerLiteral(1)
            ])
        ]);

        parser.feed('a := (  1  )\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.IntegerLiteral(1)
            ])
        ]);

        parser.feed('a := (1 + 2)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.IntegerLiteral(1), new G.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := 1 / (2 + 3)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.DIV,
                    new G.IntegerLiteral(1),
                    new G.BinaryExpression([ G.BinaryIntegerOperator.ADD, new G.IntegerLiteral(2), new G.IntegerLiteral(3) ])
                ])
            ])
        ]);
    });
});

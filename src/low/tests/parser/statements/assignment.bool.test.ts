import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';


describe('Parser:statements:assignment:bool', () => {
    test('variable assignment (bool literal)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := true\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.BooleanLiteral(true) ])
        ]);

        parser.feed('a := false\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.BooleanLiteral(false) ])
        ]);
    });

    test('variable assignment (bool unary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := !true\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([ G.UnaryBooleanOperator.NOT, new G.BooleanLiteral(true) ])
            ])
        ]);

        parser.feed('a := !!true\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([
                    G.UnaryBooleanOperator.NOT,
                    new G.UnaryExpression([
                        G.UnaryBooleanOperator.NOT,
                        new G.BooleanLiteral(true)
                    ])
                ])
            ])
        ]);

        parser.feed('a := !!b\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.UnaryExpression([
                    G.UnaryBooleanOperator.NOT,
                    new G.UnaryExpression([
                        G.UnaryBooleanOperator.NOT,
                        new G.VarName('b')
                    ])
                ])
            ])
        ]);
    });

    test('variable assignment (bool binary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := true = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := 1 = 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.IntegerLiteral(1), new G.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := b + 1 = 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.EQ,
                    new G.BinaryExpression([
                        G.BinaryIntegerOperator.ADD,
                        new G.VarName('b'),
                        new G.IntegerLiteral(1)
                    ]),
                    new G.IntegerLiteral(2)
                ])
            ])
        ]);

        parser.feed('a := b = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.VarName('b'), new G.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := true != false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryBooleanOperator.NEQ, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := !true = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.EQ,
                    new G.UnaryExpression([ G.UnaryBooleanOperator.NOT, new G.BooleanLiteral(true) ]),
                    new G.BooleanLiteral(false)
                ])
            ])
        ]);

        parser.feed('a := true != false || false = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.OR,
                    new G.BinaryExpression([ G.BinaryBooleanOperator.NEQ, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ]),
                    new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.BooleanLiteral(false), new G.BooleanLiteral(false) ])
                ])
            ])
        ]);

        parser.feed('a := true && false = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.AND,
                    new G.BooleanLiteral(true),
                    new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.BooleanLiteral(false), new G.BooleanLiteral(false) ])
                ])
            ])
        ]);

        parser.feed('a := b && c = d\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.AND,
                    new G.VarName('b'),
                    new G.BinaryExpression([ G.BinaryBooleanOperator.EQ, new G.VarName('c'), new G.VarName('d') ])
                ])
            ])
        ]);

        parser.feed('a := true && false = !false || true != false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.OR,
                    new G.BinaryExpression([
                        G.BinaryBooleanOperator.AND,
                        new G.BooleanLiteral(true),
                        new G.BinaryExpression([
                            G.BinaryBooleanOperator.EQ,
                            new G.BooleanLiteral(false),
                            new G.UnaryExpression([ G.UnaryBooleanOperator.NOT, new G.BooleanLiteral(false) ])
                        ])
                    ]),
                    new G.BinaryExpression([ G.BinaryBooleanOperator.NEQ, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ])
                ])
            ])
        ]);
    });

    test('variable assignment (nested bool)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := (true)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BooleanLiteral(true)
            ])
        ]);

        parser.feed('a := (  true  )\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BooleanLiteral(true)
            ])
        ]);

        parser.feed('a := (true != false)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([ G.BinaryBooleanOperator.NEQ, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := (true && false) = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.EQ,
                    new G.BinaryExpression([ G.BinaryBooleanOperator.AND, new G.BooleanLiteral(true), new G.BooleanLiteral(false) ]),
                    new G.BooleanLiteral(false)
                ])
            ])
        ]);
    });
});

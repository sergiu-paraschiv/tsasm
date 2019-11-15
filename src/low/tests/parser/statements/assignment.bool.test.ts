import { Parser } from '../../../parser/Parser';
import * as L from '../../../parser/ParserGrammarLexemes';
import * as E from '../../../grammar/Expression';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:assignment:bool', () => {
    test('variable assignment (bool literal)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := true\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.BooleanLiteral(true) ])
        ]);

        parser.feed('a := false\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'), new L.BooleanLiteral(false) ])
        ]);
    });

    test('variable assignment (bool unary)', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := !true\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([ L.UnaryBooleanOperator.NOT, new L.BooleanLiteral(true) ])
            ])
        ]);

        parser.feed('a := !!true\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([
                    L.UnaryBooleanOperator.NOT,
                    new E.UnaryExpression([
                        L.UnaryBooleanOperator.NOT,
                        new L.BooleanLiteral(true)
                    ])
                ])
            ])
        ]);

        parser.feed('a := !!b\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.UnaryExpression([
                    L.UnaryBooleanOperator.NOT,
                    new E.UnaryExpression([
                        L.UnaryBooleanOperator.NOT,
                        new L.VarName('b')
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
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := 1 = 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.IntegerLiteral(1), new L.IntegerLiteral(2) ])
            ])
        ]);

        parser.feed('a := b + 1 = 2\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.EQ,
                    new E.BinaryExpression([
                        L.BinaryIntegerOperator.ADD,
                        new L.VarName('b'),
                        new L.IntegerLiteral(1)
                    ]),
                    new L.IntegerLiteral(2)
                ])
            ])
        ]);

        parser.feed('a := b = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.VarName('b'), new L.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := true != false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryBooleanOperator.NEQ, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := !true = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.EQ,
                    new E.UnaryExpression([ L.UnaryBooleanOperator.NOT, new L.BooleanLiteral(true) ]),
                    new L.BooleanLiteral(false)
                ])
            ])
        ]);

        parser.feed('a := true != false || false = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.OR,
                    new E.BinaryExpression([ L.BinaryBooleanOperator.NEQ, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ]),
                    new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.BooleanLiteral(false), new L.BooleanLiteral(false) ])
                ])
            ])
        ]);

        parser.feed('a := true && false = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.AND,
                    new L.BooleanLiteral(true),
                    new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.BooleanLiteral(false), new L.BooleanLiteral(false) ])
                ])
            ])
        ]);

        parser.feed('a := b && c = d\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.AND,
                    new L.VarName('b'),
                    new E.BinaryExpression([ L.BinaryBooleanOperator.EQ, new L.VarName('c'), new L.VarName('d') ])
                ])
            ])
        ]);

        parser.feed('a := true && false = !false || true != false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.OR,
                    new E.BinaryExpression([
                        L.BinaryBooleanOperator.AND,
                        new L.BooleanLiteral(true),
                        new E.BinaryExpression([
                            L.BinaryBooleanOperator.EQ,
                            new L.BooleanLiteral(false),
                            new E.UnaryExpression([ L.UnaryBooleanOperator.NOT, new L.BooleanLiteral(false) ])
                        ])
                    ]),
                    new E.BinaryExpression([ L.BinaryBooleanOperator.NEQ, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ])
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
            new S.VarAssignment([ new L.VarName('a'),
                new L.BooleanLiteral(true)
            ])
        ]);

        parser.feed('a := (  true  )\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new L.BooleanLiteral(true)
            ])
        ]);

        parser.feed('a := (true != false)\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([ L.BinaryBooleanOperator.NEQ, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ])
            ])
        ]);

        parser.feed('a := (true && false) = false\n');
        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarAssignment([ new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryBooleanOperator.EQ,
                    new E.BinaryExpression([ L.BinaryBooleanOperator.AND, new L.BooleanLiteral(true), new L.BooleanLiteral(false) ]),
                    new L.BooleanLiteral(false)
                ])
            ])
        ]);
    });
});

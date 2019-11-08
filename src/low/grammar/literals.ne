@lexer lexer


BooleanLiteral -> %booleanLiteral    {% d => new G.BooleanLiteral(U.bool(d[0])) %}

IntegerLiteral -> %integerLiteral    {% d => new G.IntegerLiteral(U.int(d[0])) %}

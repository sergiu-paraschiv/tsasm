@lexer lexer


BooleanLiteral -> %booleanLiteral    {% d => new L.BooleanLiteral(U.bool(d[0])) %}

IntegerLiteral -> %integerLiteral    {% d => new L.IntegerLiteral(U.int(d[0])) %}

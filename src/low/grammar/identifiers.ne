@lexer lexer


VarName -> %identifier    {% d => new G.VarName(d[0]) %}

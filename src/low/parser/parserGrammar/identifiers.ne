@lexer lexer


VarName -> %identifier    {% d => new L.VarName(d[0]) %}

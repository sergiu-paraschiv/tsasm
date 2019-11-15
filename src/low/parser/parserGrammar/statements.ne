@lexer lexer

StatementList -> StatementWithWitespace:* OWS   {% id %}

StatementWithWitespace -> WS StatementWithWitespace    {% d => d[1] %}
                        | Statement                    {% id %}

Statement -> Comment EOL               {% id %}
           | VarDeclaration OWS EOL    {% id %}
           | VarAssignment OWS EOL     {% id %}
           | BlockStatement OWS EOL    {% id %}
           | IfStatement OWS EOL       {% id %}
           | EOL                       {% id %}


IfStatement -> "if" OWS "(" OWS Expression OWS ")" OWS BlockStatement    {% d => new S.IfStatement([ d[4], d[8] ]) %}

BlockStatement -> "{" StatementList "}"    {% d => new S.Block(d[1]) %}

VarAssignment -> VarName  AWS ":=" AWS  Expression    {% d => new S.VarAssignment([ d[0], d[4] ]) %}

VarDeclaration -> BasicType WS VarName                              {% d => new S.VarDeclaration([ d[0], d[2] ]) %}
                | BasicType WS VarName  AWS ":=" AWS  Expression    {% d => new S.VarDeclaration([ d[0], d[2], d[6] ]) %}

Comment -> "#" Characters    {% d => new S.Comment(d[1]) %}
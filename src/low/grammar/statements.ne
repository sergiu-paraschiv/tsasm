@lexer lexer

StatementList -> OWS Statement:* OWS   {% d => d[1] %}

Statement -> Comment EOL               {% id %}
           | VarDeclaration OWS EOL    {% id %}
           | VarAssignment OWS EOL     {% id %}
           | BlockStatement OWS EOL    {% id %}
           | IfStatement OWS EOL       {% id %}
           | EOL                       {% id %}

IfStatement -> "if" OWS "(" OWS Expression OWS ")" OWS BlockStatement    {% d => new G.IfStatement([ d[4], d[8] ]) %}

BlockStatement -> "{" StatementList "}"    {% d => new G.Block(d[1]) %}

VarAssignment -> VarName         AWS ":=" AWS  Expression    {% d => new G.VarAssignment([ d[0], d[4] ]) %}
               | VarDeclaration  AWS ":=" AWS  Expression    {% d => new G.VarAssignment([ d[0], d[4] ]) %}

VarDeclaration -> BasicType WS VarName    {% d => new G.VarDeclaration([ d[0], d[2] ]) %}

Comment -> "#" Characters    {% d => new G.Comment(d[1]) %}
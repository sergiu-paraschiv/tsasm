@lexer lexer


Expression -> OrExpression    {% id %}

OrExpression -> OrExpression AWS "||" AWS AndExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
              | AndExpression                              {% id %}

AndExpression -> AndExpression AWS "&&" AWS CmpExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | CmpExpression                               {% id %}

CmpExpression -> CmpExpression AWS "=" AWS AddExpression     {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | CmpExpression AWS "!=" AWS AddExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | AddExpression                               {% id %}

AddExpression -> AddExpression AWS "+" AWS MulExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | AddExpression AWS "-" AWS MulExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | MulExpression                              {% id %}

MulExpression -> MulExpression AWS "*" WS UnaryExpression     {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | MulExpression AWS "/" AWS UnaryExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | MulExpression AWS "%" AWS UnaryExpression    {% d => new G.BinaryExpression([ d[2], d[0], d[4] ]) %}
               | UnaryExpression                              {% id %}

UnaryExpression -> "!" UnaryExpression             {% d => new G.UnaryExpression([ d[0], d[1] ]) %}
                 | "+" UnaryExpression             {% d => new G.UnaryExpression([ d[0], d[1] ]) %}
                 | "-" UnaryExpression             {% d => new G.UnaryExpression([ d[0], d[1] ]) %}
                 | PrimaryExpression               {% id %}

PrimaryExpression -> "(" OAWS Expression OAWS ")"    {% d => d[2] %} # yes, recursive
                   | VarName                         {% id %}
                   | BooleanLiteral                  {% id %}
                   | IntegerLiteral                  {% id %}
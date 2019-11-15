@lexer lexer


Characters      -> .:+         {% d => U.val(d[0]) %}

OAWS    -> null    {% d => null %}
         | AWS     {% d => null %}

OWS     -> null    {% d => null %}
         | WS      {% d => null %}

WS      -> Space       {% d => null %}
         | Space WS    {% d => null %}

AWS     -> Space        {% d => null %}
         | EOL          {% id %}
         | Space AWS    {% d => null %}
         | EOL AWS      {% d => null %}

Space   -> [" "\t]    {% d => null %}

EOL     -> [\n]    {% d => new S.EndOfLine(d[0]) %}
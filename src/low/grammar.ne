@{%

const moo = require('moo');

const lexer = moo.compile({
  ws:           /[ \t]+/,
  eol:          { match: /\n/, lineBreaks: true },
  float:        /0\.[0-9]+|[1-9][0-9]*\.[0-9]+|-0\.[0-9]+|-[1-9][0-9]*\.[0-9]+/,
  int:          /0|[1-9][0-9]*|-[1-9][0-9]*/,
  keyWord:      [ 'let' ],
  operator:     { match: /[\+\-\*\/\%]/, type: moo.keywords({
                  'sum': '+',
                  'diff': '-',
                  'mul': '*',
                  'div': '/',
                  'mod': '%'
                }) },
  varName:      /[a-zA-Z][a-zA-Z0-9_]*/
});

const _o = term => ({ t: term.type });
const _v = term => ({ t: term.type, v: term.value });
const _vn = term => ({ t: term.type, v: term.type === 'int' ? parseInt(term.value, 10) :  parseFloat(term.value) });

%}

@lexer lexer


main      -> line:*                             {% id %}

line      -> statement %ws %eol                 {% id %}
           | statement %eol                     {% id %}
           | math %eol                          {% id %}

math      -> sum                                {% id %}

sum       -> number %ws "+" %ws number          {% d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ] %}
           | number %ws "-" %ws number          {% d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ] %}
           | prod                               {% id %}

prod      -> number %ws "*" %ws number          {% d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ] %}
           | number %ws "/" %ws number          {% d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ] %}
           | number %ws "%" %ws number          {% d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ] %}

number    -> %int                               {% id %}
           | %float                             {% id %}

statement -> "let" %ws %varName                 {% d => [ _v(d[0]), _v(d[2]) ] %}
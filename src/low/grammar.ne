@{%

const {
    Const,
    Declare,
    Assign,
    MathOp,
    BinOp
} = require('./ParserStatements');

const moo = require('moo');

const lexer = moo.compile({
  ws:           /[ \t]+/,
  eol:          { match: /\n/, lineBreaks: true },
  float:        /0\.[0-9]+|[1-9][0-9]*\.[0-9]+|-0\.[0-9]+|-[1-9][0-9]*\.[0-9]+/,
  int:          /0|[1-9][0-9]*|-[1-9][0-9]*/,
  lp:           '(',
  rp:           ')',
  keyWord:      [ 'int', ':=' ],
  operator:     { match: /[\+\-\*\/\%\^]/, type: moo.keywords({
                  'sum': '+',
                  'sub': '-',
                  'mul': '*',
                  'div': '/',
                  'mod': '%',
                  'exp': '^'
                }) },
  varName:      /[a-zA-Z][a-zA-Z0-9_]*/
});

const _t  = term    => term.type;
const _v  = term    => term.value;
const _vi = term    => parseInt(term.value, 10);
const _vf = term    => parseFloat(term.value);

%}

@lexer lexer


main      -> line:*                                 {% id %}

line      -> statement %ws %eol                     {% id %}
           | statement %eol                         {% id %}
           | %ws statement %ws %eol                 {% d => d[1] %}
           | %ws statement %eol                     {% d => d[1] %}
           | %ws %eol %ws                           {% d => null %}
           | %ws %eol                               {% d => null %}
           | %eol                                   {% d => null %}


statement -> "int" %ws %varName                          {% d => new Declare(_v(d[2])) %}
           | "int" %ws %varName %ws ":=" %ws bin_math    {% d => new Declare(_v(d[2]), d[6]) %}
           | %varName %ws ":=" %ws bin_math              {% d => new Assign(_v(d[0]), d[4]) %}


bin_math  -> sum                                    {% id %}

sum       -> sum %ws "+" %ws prod                   {% d => new BinOp(MathOp.SUM, d[0], d[4]) %}
           | sum %ws "-" %ws prod                   {% d => new BinOp(MathOp.SUB, d[0], d[4]) %}
           | prod                                   {% id %}

prod      -> prod %ws "*" %ws exp                   {% d => new BinOp(MathOp.MUL, d[0], d[4]) %}
           | prod %ws "/" %ws exp                   {% d => new BinOp(MathOp.DIV, d[0], d[4]) %}
           | prod %ws "%" %ws exp                   {% d => new BinOp(MathOp.MOD, d[0], d[4]) %}
           | exp                                    {% id %}

exp       -> exp %ws "^" %ws bin_math_op            {% d => new BinOp(MathOp.EXP, d[0], d[4]) %}
           | bin_math_op                            {% id %}

bin_math_op -> %int                                 {% d => new Const(_vi(d[0])) %}
             | %varName                             {% d => _v(d[0]) %}
             | %lp %ws bin_math %ws %rp             {% d => d[2] %}       # yes, recursive

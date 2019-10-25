// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "line", "symbols": ["statement", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": id},
    {"name": "line", "symbols": ["statement", (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": id},
    {"name": "line", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "statement", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": d => d[1]},
    {"name": "line", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "statement", (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": d => d[1]},
    {"name": "line", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eol") ? {type: "eol"} : eol), (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": d => null},
    {"name": "line", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": d => null},
    {"name": "line", "symbols": [(lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": d => null},
    {"name": "statement", "symbols": [{"literal":"int"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("varName") ? {type: "varName"} : varName)], "postprocess": d => new Declare(_v(d[2]))},
    {"name": "statement", "symbols": [{"literal":"int"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("varName") ? {type: "varName"} : varName), (lexer.has("ws") ? {type: "ws"} : ws), {"literal":":="}, (lexer.has("ws") ? {type: "ws"} : ws), "bin_math"], "postprocess": d => new Declare(_v(d[2]), d[6])},
    {"name": "statement", "symbols": [(lexer.has("varName") ? {type: "varName"} : varName), (lexer.has("ws") ? {type: "ws"} : ws), {"literal":":="}, (lexer.has("ws") ? {type: "ws"} : ws), "bin_math"], "postprocess": d => new Assign(_v(d[0]), d[4])},
    {"name": "bin_math", "symbols": ["sum"], "postprocess": id},
    {"name": "sum", "symbols": ["sum", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"+"}, (lexer.has("ws") ? {type: "ws"} : ws), "prod"], "postprocess": d => new BinOp(MathOp.SUM, d[0], d[4])},
    {"name": "sum", "symbols": ["sum", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"-"}, (lexer.has("ws") ? {type: "ws"} : ws), "prod"], "postprocess": d => new BinOp(MathOp.SUB, d[0], d[4])},
    {"name": "sum", "symbols": ["prod"], "postprocess": id},
    {"name": "prod", "symbols": ["prod", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"*"}, (lexer.has("ws") ? {type: "ws"} : ws), "exp"], "postprocess": d => new BinOp(MathOp.MUL, d[0], d[4])},
    {"name": "prod", "symbols": ["prod", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"/"}, (lexer.has("ws") ? {type: "ws"} : ws), "exp"], "postprocess": d => new BinOp(MathOp.DIV, d[0], d[4])},
    {"name": "prod", "symbols": ["prod", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"%"}, (lexer.has("ws") ? {type: "ws"} : ws), "exp"], "postprocess": d => new BinOp(MathOp.MOD, d[0], d[4])},
    {"name": "prod", "symbols": ["exp"], "postprocess": id},
    {"name": "exp", "symbols": ["exp", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"^"}, (lexer.has("ws") ? {type: "ws"} : ws), "bin_math_op"], "postprocess": d => new BinOp(MathOp.EXP, d[0], d[4])},
    {"name": "exp", "symbols": ["bin_math_op"], "postprocess": id},
    {"name": "bin_math_op", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": d => new Const(_vi(d[0]))},
    {"name": "bin_math_op", "symbols": [(lexer.has("varName") ? {type: "varName"} : varName)], "postprocess": d => _v(d[0])},
    {"name": "bin_math_op", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), (lexer.has("ws") ? {type: "ws"} : ws), "bin_math", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": d => d[2]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

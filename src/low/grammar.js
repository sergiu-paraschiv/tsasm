// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "line", "symbols": ["statement", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": id},
    {"name": "line", "symbols": ["statement", (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": id},
    {"name": "line", "symbols": ["math", (lexer.has("eol") ? {type: "eol"} : eol)], "postprocess": id},
    {"name": "math", "symbols": ["sum"], "postprocess": id},
    {"name": "sum", "symbols": ["number", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"+"}, (lexer.has("ws") ? {type: "ws"} : ws), "number"], "postprocess": d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ]},
    {"name": "sum", "symbols": ["number", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"-"}, (lexer.has("ws") ? {type: "ws"} : ws), "number"], "postprocess": d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ]},
    {"name": "sum", "symbols": ["prod"], "postprocess": id},
    {"name": "prod", "symbols": ["number", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"*"}, (lexer.has("ws") ? {type: "ws"} : ws), "number"], "postprocess": d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ]},
    {"name": "prod", "symbols": ["number", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"/"}, (lexer.has("ws") ? {type: "ws"} : ws), "number"], "postprocess": d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ]},
    {"name": "prod", "symbols": ["number", (lexer.has("ws") ? {type: "ws"} : ws), {"literal":"%"}, (lexer.has("ws") ? {type: "ws"} : ws), "number"], "postprocess": d => [ _o(d[2]), _vn(d[0]), _vn(d[4]) ]},
    {"name": "number", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("float") ? {type: "float"} : float)], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"let"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("varName") ? {type: "varName"} : varName)], "postprocess": d => [ _v(d[0]), _v(d[2]) ]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

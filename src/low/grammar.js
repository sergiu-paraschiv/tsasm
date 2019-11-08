// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');
const U = require('./ParserUtils');
const G = require('./ParserGrammar');

const lexer = moo.compile({
    WS: /[ \t]+/,
    EOL: { match: /\n/, lineBreaks: true },
    booleanLiteral: /true|false/,
    identifier: { match: /[a-zA-Z_][a-zA-Z_0-9]*/, type: moo.keywords({
        basicType: [ 'bool', 'int', 'uint', 'float', 'char', 'void' ],
        keyword: [ 'if', 'else' ],
    })},
    integerLiteral: /0|[1-9][0-9]*/,
    lineComment: '#',
    operator: [ '!=', '=', ':=', '!', '+', '-', '*', '/', '%', '||', '&&' ],
    lp: "(",
    rp: ")",
    lpc: "{",
    rpc: "}",
    lps: "[",
    rps: "]"
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["StatementList"], "postprocess": id},
    {"name": "StatementList$ebnf$1", "symbols": []},
    {"name": "StatementList$ebnf$1", "symbols": ["StatementList$ebnf$1", "Statement"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StatementList", "symbols": ["OWS", "StatementList$ebnf$1", "OWS"], "postprocess": d => d[1]},
    {"name": "Statement", "symbols": ["Comment", "EOL"], "postprocess": id},
    {"name": "Statement", "symbols": ["VarDeclaration", "OWS", "EOL"], "postprocess": id},
    {"name": "Statement", "symbols": ["VarAssignment", "OWS", "EOL"], "postprocess": id},
    {"name": "Statement", "symbols": ["BlockStatement", "OWS", "EOL"], "postprocess": id},
    {"name": "Statement", "symbols": ["IfStatement", "OWS", "EOL"], "postprocess": id},
    {"name": "Statement", "symbols": ["EOL"], "postprocess": id},
    {"name": "IfStatement", "symbols": [{"literal":"if"}, "OWS", {"literal":"("}, "OWS", "Expression", "OWS", {"literal":")"}, "OWS", "BlockStatement"], "postprocess": d => new G.IfStatement([ d[4], d[8] ])},
    {"name": "BlockStatement", "symbols": [{"literal":"{"}, "StatementList", {"literal":"}"}], "postprocess": d => new G.Block(d[1])},
    {"name": "VarAssignment", "symbols": ["VarName", "AWS", {"literal":":="}, "AWS", "Expression"], "postprocess": d => new G.VarAssignment([ d[0], d[4] ])},
    {"name": "VarAssignment", "symbols": ["VarDeclaration", "AWS", {"literal":":="}, "AWS", "Expression"], "postprocess": d => new G.VarAssignment([ d[0], d[4] ])},
    {"name": "VarDeclaration", "symbols": ["BasicType", "WS", "VarName"], "postprocess": d => new G.VarDeclaration([ d[0], d[2] ])},
    {"name": "Comment", "symbols": [{"literal":"#"}, "Characters"], "postprocess": d => new G.Comment(d[1])},
    {"name": "VarName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": d => new G.VarName(d[0])},
    {"name": "BasicType", "symbols": [(lexer.has("basicType") ? {type: "basicType"} : basicType)], "postprocess": id},
    {"name": "Expression", "symbols": ["OrExpression"], "postprocess": id},
    {"name": "OrExpression", "symbols": ["OrExpression", "AWS", {"literal":"||"}, "AWS", "AndExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "OrExpression", "symbols": ["AndExpression"], "postprocess": id},
    {"name": "AndExpression", "symbols": ["AndExpression", "AWS", {"literal":"&&"}, "AWS", "CmpExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "AndExpression", "symbols": ["CmpExpression"], "postprocess": id},
    {"name": "CmpExpression", "symbols": ["CmpExpression", "AWS", {"literal":"="}, "AWS", "AddExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "CmpExpression", "symbols": ["CmpExpression", "AWS", {"literal":"!="}, "AWS", "AddExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "CmpExpression", "symbols": ["AddExpression"], "postprocess": id},
    {"name": "AddExpression", "symbols": ["AddExpression", "AWS", {"literal":"+"}, "AWS", "MulExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "AddExpression", "symbols": ["AddExpression", "AWS", {"literal":"-"}, "AWS", "MulExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "AddExpression", "symbols": ["MulExpression"], "postprocess": id},
    {"name": "MulExpression", "symbols": ["MulExpression", "AWS", {"literal":"*"}, "WS", "UnaryExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "MulExpression", "symbols": ["MulExpression", "AWS", {"literal":"/"}, "AWS", "UnaryExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "MulExpression", "symbols": ["MulExpression", "AWS", {"literal":"%"}, "AWS", "UnaryExpression"], "postprocess": d => new G.BinaryExpression([ d[2], d[0], d[4] ])},
    {"name": "MulExpression", "symbols": ["UnaryExpression"], "postprocess": id},
    {"name": "UnaryExpression", "symbols": [{"literal":"!"}, "UnaryExpression"], "postprocess": d => new G.UnaryExpression([ d[0], d[1] ])},
    {"name": "UnaryExpression", "symbols": [{"literal":"+"}, "UnaryExpression"], "postprocess": d => new G.UnaryExpression([ d[0], d[1] ])},
    {"name": "UnaryExpression", "symbols": [{"literal":"-"}, "UnaryExpression"], "postprocess": d => new G.UnaryExpression([ d[0], d[1] ])},
    {"name": "UnaryExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": [{"literal":"("}, "OAWS", "Expression", "OAWS", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "PrimaryExpression", "symbols": ["VarName"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["BooleanLiteral"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["IntegerLiteral"], "postprocess": id},
    {"name": "BooleanLiteral", "symbols": [(lexer.has("booleanLiteral") ? {type: "booleanLiteral"} : booleanLiteral)], "postprocess": d => new G.BooleanLiteral(U.bool(d[0]))},
    {"name": "IntegerLiteral", "symbols": [(lexer.has("integerLiteral") ? {type: "integerLiteral"} : integerLiteral)], "postprocess": d => new G.IntegerLiteral(U.int(d[0]))},
    {"name": "Characters$ebnf$1", "symbols": [/./]},
    {"name": "Characters$ebnf$1", "symbols": ["Characters$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Characters", "symbols": ["Characters$ebnf$1"], "postprocess": d => U.val(d[0])},
    {"name": "OAWS", "symbols": [], "postprocess": d => null},
    {"name": "OAWS", "symbols": ["AWS"], "postprocess": d => null},
    {"name": "OWS", "symbols": [], "postprocess": d => null},
    {"name": "OWS", "symbols": ["WS"], "postprocess": d => null},
    {"name": "WS", "symbols": ["Space"], "postprocess": d => null},
    {"name": "WS", "symbols": ["Space", "WS"], "postprocess": d => null},
    {"name": "AWS", "symbols": ["Space"], "postprocess": d => null},
    {"name": "AWS", "symbols": ["EOL"], "postprocess": id},
    {"name": "AWS", "symbols": ["Space", "AWS"], "postprocess": d => null},
    {"name": "AWS", "symbols": ["EOL", "AWS"], "postprocess": d => null},
    {"name": "Space", "symbols": [/[" "\t]/], "postprocess": d => null},
    {"name": "EOL", "symbols": [/[\n]/], "postprocess": d => new G.EndOfLine(d[0])}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

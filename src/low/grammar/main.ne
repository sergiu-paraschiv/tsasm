@{%
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
%}

@lexer lexer

main -> StatementList    {% id %}


@include "./statements.ne"
@include "./identifiers.ne"
@include "./types.ne"
@include "./expressions.ne"
@include "./literals.ne"
@include "./charset.ne"

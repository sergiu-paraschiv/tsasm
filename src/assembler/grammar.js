// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "segment_w"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "segment_w", "symbols": ["_", "__n"], "postprocess": d => null},
    {"name": "segment_w", "symbols": ["_", "segment", "_", "__n"], "postprocess": d => d[1]},
    {"name": "segment", "symbols": ["instr"], "postprocess": id},
    {"name": "segment", "symbols": ["label", {"literal":":"}, "__", "instr"], "postprocess": d => { return { label: d[0].label, op: d[3] } }},
    {"name": "segment", "symbols": ["dir"], "postprocess": id},
    {"name": "segment", "symbols": ["label", {"literal":":"}, "__", "dir"], "postprocess": d => { return { label: d[0].label, op: d[3] } }},
    {"name": "dir$string$1", "symbols": [{"literal":"."}, {"literal":"a"}, {"literal":"s"}, {"literal":"c"}, {"literal":"i"}, {"literal":"i"}, {"literal":"z"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "dir$ebnf$1", "symbols": []},
    {"name": "dir$ebnf$1", "symbols": ["dir$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dir", "symbols": ["dir$string$1", "__", {"literal":"'"}, "dir$ebnf$1", {"literal":"'"}], "postprocess": d => [ d[0], d[3].join("") ]},
    {"name": "instr", "symbols": ["instr_no_op"], "postprocess": d => [ d[0] ]},
    {"name": "instr", "symbols": ["instr_1_reg", "__", "reg"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr", "symbols": ["instr_1_label", "__", "label"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr", "symbols": ["instr_2_reg", "__", "reg", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr", "symbols": ["instr_3_reg", "__", "reg", "__", "reg", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4], d[6] ]},
    {"name": "instr", "symbols": ["instr_reg_list", "__", "reg_list"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr$string$1", "symbols": [{"literal":"L"}, {"literal":"O"}, {"literal":"A"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$1", "__", "reg", "__", "int"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$2", "symbols": [{"literal":"L"}, {"literal":"O"}, {"literal":"A"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$2", "__", "reg", "__", "addr"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$3", "symbols": [{"literal":"S"}, {"literal":"A"}, {"literal":"V"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$3", "__", "addr", "__", "int"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$4", "symbols": [{"literal":"S"}, {"literal":"A"}, {"literal":"V"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$4", "__", "addr", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr_no_op$string$1", "symbols": [{"literal":"H"}, {"literal":"A"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_no_op", "symbols": ["instr_no_op$string$1"], "postprocess": id},
    {"name": "instr_no_op$string$2", "symbols": [{"literal":"R"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_no_op", "symbols": ["instr_no_op$string$2"], "postprocess": id},
    {"name": "instr_1_label$string$1", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$1"], "postprocess": id},
    {"name": "instr_1_label$string$2", "symbols": [{"literal":"J"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$2"], "postprocess": id},
    {"name": "instr_1_label$string$3", "symbols": [{"literal":"J"}, {"literal":"N"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$3"], "postprocess": id},
    {"name": "instr_1_label$string$4", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$4"], "postprocess": id},
    {"name": "instr_1_label$string$5", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$5"], "postprocess": id},
    {"name": "instr_1_label$string$6", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$6"], "postprocess": id},
    {"name": "instr_1_label$string$7", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$7"], "postprocess": id},
    {"name": "instr_1_label$string$8", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"T"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$8"], "postprocess": id},
    {"name": "instr_1_label$string$9", "symbols": [{"literal":"C"}, {"literal":"A"}, {"literal":"L"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_label", "symbols": ["instr_1_label$string$9"], "postprocess": id},
    {"name": "instr_1_reg$string$1", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$1"], "postprocess": id},
    {"name": "instr_1_reg$string$2", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$2"], "postprocess": id},
    {"name": "instr_1_reg$string$3", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}, {"literal":"B"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$3"], "postprocess": id},
    {"name": "instr_1_reg$string$4", "symbols": [{"literal":"J"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$4"], "postprocess": id},
    {"name": "instr_1_reg$string$5", "symbols": [{"literal":"J"}, {"literal":"N"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$5"], "postprocess": id},
    {"name": "instr_1_reg$string$6", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$6"], "postprocess": id},
    {"name": "instr_1_reg$string$7", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$7"], "postprocess": id},
    {"name": "instr_1_reg$string$8", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$8"], "postprocess": id},
    {"name": "instr_1_reg$string$9", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$9"], "postprocess": id},
    {"name": "instr_1_reg$string$10", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$10"], "postprocess": id},
    {"name": "instr_1_reg$string$11", "symbols": [{"literal":"P"}, {"literal":"O"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_1_reg", "symbols": ["instr_1_reg$string$11"], "postprocess": id},
    {"name": "instr_2_reg$string$1", "symbols": [{"literal":"C"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_2_reg", "symbols": ["instr_2_reg$string$1"], "postprocess": id},
    {"name": "instr_3_reg$string$1", "symbols": [{"literal":"A"}, {"literal":"D"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_3_reg", "symbols": ["instr_3_reg$string$1"], "postprocess": id},
    {"name": "instr_3_reg$string$2", "symbols": [{"literal":"S"}, {"literal":"U"}, {"literal":"B"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_3_reg", "symbols": ["instr_3_reg$string$2"], "postprocess": id},
    {"name": "instr_3_reg$string$3", "symbols": [{"literal":"D"}, {"literal":"I"}, {"literal":"V"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_3_reg", "symbols": ["instr_3_reg$string$3"], "postprocess": id},
    {"name": "instr_3_reg$string$4", "symbols": [{"literal":"M"}, {"literal":"U"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_3_reg", "symbols": ["instr_3_reg$string$4"], "postprocess": id},
    {"name": "instr_reg_list$string$1", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_list", "symbols": ["instr_reg_list$string$1"], "postprocess": id},
    {"name": "instr_reg_list$string$2", "symbols": [{"literal":"P"}, {"literal":"O"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_list", "symbols": ["instr_reg_list$string$2"], "postprocess": id},
    {"name": "addr", "symbols": [{"literal":"["}, "int", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: 0 } }},
    {"name": "addr", "symbols": [{"literal":"["}, "reg", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: 0 } }},
    {"name": "addr", "symbols": [{"literal":"["}, "int", {"literal":","}, "__", "int", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: d[4] } }},
    {"name": "addr", "symbols": [{"literal":"["}, "reg", {"literal":","}, "__", "int", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: d[4] } }},
    {"name": "label$ebnf$1", "symbols": []},
    {"name": "label$ebnf$1", "symbols": ["label$ebnf$1", /[A-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "label", "symbols": [{"literal":"."}, /[A-Z]/, "label$ebnf$1"], "postprocess": d => { return { label: "." + d[1] + d[2].join("") } }},
    {"name": "label$ebnf$2", "symbols": []},
    {"name": "label$ebnf$2", "symbols": ["label$ebnf$2", /[A-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "label", "symbols": [/[A-Z]/, "label$ebnf$2"], "postprocess": d => { return { label: d[0] + d[1].join("") } }},
    {"name": "reg_list$ebnf$1$subexpression$1", "symbols": ["reg", "__"]},
    {"name": "reg_list$ebnf$1", "symbols": ["reg_list$ebnf$1$subexpression$1"]},
    {"name": "reg_list$ebnf$1$subexpression$2", "symbols": ["reg", "__"]},
    {"name": "reg_list$ebnf$1", "symbols": ["reg_list$ebnf$1", "reg_list$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "reg_list", "symbols": [{"literal":"{"}, "__", "reg_list$ebnf$1", {"literal":"}"}], "postprocess":  (d, l, reject) => {
            if (d[2].length > 5) {
                return reject;
            }
            return { reglist: d[2].map(r => r[0].reg) };
        } },
    {"name": "reg", "symbols": [{"literal":"$"}, "int"], "postprocess":  (d, l, reject) => {
            if (d[1] > 15) {
                return reject;
            }
        
            return { reg: d[1] };
        } },
    {"name": "int", "symbols": [/[0-9]/], "postprocess": d => parseInt(d, 10)},
    {"name": "int", "symbols": ["int", /[0-9]/], "postprocess": d => parseInt(d[0] + d[1], 10)},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["_", /[" "\t]/], "postprocess": d => null},
    {"name": "__", "symbols": [/[" "\t]/]},
    {"name": "__", "symbols": ["__", /[" "\t]/], "postprocess": d => null},
    {"name": "__n", "symbols": [/[\n]/], "postprocess": d => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

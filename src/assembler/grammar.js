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
    {"name": "dir$string$2", "symbols": [{"literal":"."}, {"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"c"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "dir", "symbols": ["dir$string$2", "__", "uint16"], "postprocess":  (d, l, reject) => {
            if (d[2] % 4) {
                return reject;
            }
            return [ d[0], d[2] ];
        } },
    {"name": "instr", "symbols": ["instr_no_op"], "postprocess": d => [ d[0] ]},
    {"name": "instr", "symbols": ["instr_reg", "__", "reg"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr", "symbols": ["instr_label", "__", "label"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr", "symbols": ["instr_reg_reg", "__", "reg", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr", "symbols": ["instr_reg_int16", "__", "reg", "__", "int16"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr", "symbols": ["instr_reg_int8_reg", "__", "reg", "__", "int8", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4], d[6] ]},
    {"name": "instr", "symbols": ["instr_reg_reg_uint8", "__", "reg", "__", "reg", "__", "uint8"], "postprocess": d => [ d[0], d[2], d[4], d[6] ]},
    {"name": "instr", "symbols": ["instr_reg_reg_reg", "__", "reg", "__", "reg", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4], d[6] ]},
    {"name": "instr", "symbols": ["instr_reg_list", "__", "regs"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "instr$string$1", "symbols": [{"literal":"L"}, {"literal":"O"}, {"literal":"A"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$1", "__", "reg", "__", "int16"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$2", "symbols": [{"literal":"L"}, {"literal":"O"}, {"literal":"A"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$2", "__", "reg", "__", "addr"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$3", "symbols": [{"literal":"S"}, {"literal":"A"}, {"literal":"V"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$3", "__", "addr", "__", "int8"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr$string$4", "symbols": [{"literal":"S"}, {"literal":"A"}, {"literal":"V"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr", "symbols": ["instr$string$4", "__", "addr", "__", "reg"], "postprocess": d => [ d[0], d[2], d[4] ]},
    {"name": "instr_no_op$string$1", "symbols": [{"literal":"H"}, {"literal":"A"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_no_op", "symbols": ["instr_no_op$string$1"], "postprocess": id},
    {"name": "instr_no_op$string$2", "symbols": [{"literal":"R"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_no_op", "symbols": ["instr_no_op$string$2"], "postprocess": id},
    {"name": "instr_label$string$1", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$1"], "postprocess": id},
    {"name": "instr_label$string$2", "symbols": [{"literal":"J"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$2"], "postprocess": id},
    {"name": "instr_label$string$3", "symbols": [{"literal":"J"}, {"literal":"N"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$3"], "postprocess": id},
    {"name": "instr_label$string$4", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$4"], "postprocess": id},
    {"name": "instr_label$string$5", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$5"], "postprocess": id},
    {"name": "instr_label$string$6", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$6"], "postprocess": id},
    {"name": "instr_label$string$7", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$7"], "postprocess": id},
    {"name": "instr_label$string$8", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"T"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$8"], "postprocess": id},
    {"name": "instr_label$string$9", "symbols": [{"literal":"C"}, {"literal":"A"}, {"literal":"L"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_label", "symbols": ["instr_label$string$9"], "postprocess": id},
    {"name": "instr_reg$string$1", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$1"], "postprocess": id},
    {"name": "instr_reg$string$2", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$2"], "postprocess": id},
    {"name": "instr_reg$string$3", "symbols": [{"literal":"J"}, {"literal":"M"}, {"literal":"P"}, {"literal":"B"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$3"], "postprocess": id},
    {"name": "instr_reg$string$4", "symbols": [{"literal":"J"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$4"], "postprocess": id},
    {"name": "instr_reg$string$5", "symbols": [{"literal":"J"}, {"literal":"N"}, {"literal":"E"}, {"literal":"Q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$5"], "postprocess": id},
    {"name": "instr_reg$string$6", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$6"], "postprocess": id},
    {"name": "instr_reg$string$7", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$7"], "postprocess": id},
    {"name": "instr_reg$string$8", "symbols": [{"literal":"J"}, {"literal":"G"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$8"], "postprocess": id},
    {"name": "instr_reg$string$9", "symbols": [{"literal":"J"}, {"literal":"L"}, {"literal":"T"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$9"], "postprocess": id},
    {"name": "instr_reg$string$10", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$10"], "postprocess": id},
    {"name": "instr_reg$string$11", "symbols": [{"literal":"P"}, {"literal":"O"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$11"], "postprocess": id},
    {"name": "instr_reg$string$12", "symbols": [{"literal":"I"}, {"literal":"N"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$12"], "postprocess": id},
    {"name": "instr_reg$string$13", "symbols": [{"literal":"D"}, {"literal":"E"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$13"], "postprocess": id},
    {"name": "instr_reg$string$14", "symbols": [{"literal":"N"}, {"literal":"O"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg", "symbols": ["instr_reg$string$14"], "postprocess": id},
    {"name": "instr_reg_reg$string$1", "symbols": [{"literal":"C"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$1"], "postprocess": id},
    {"name": "instr_reg_reg$string$2", "symbols": [{"literal":"C"}, {"literal":"M"}, {"literal":"P"}, {"literal":"N"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$2"], "postprocess": id},
    {"name": "instr_reg_reg$string$3", "symbols": [{"literal":"M"}, {"literal":"O"}, {"literal":"V"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$3"], "postprocess": id},
    {"name": "instr_reg_reg$string$4", "symbols": [{"literal":"A"}, {"literal":"N"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$4"], "postprocess": id},
    {"name": "instr_reg_reg$string$5", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$5"], "postprocess": id},
    {"name": "instr_reg_reg$string$6", "symbols": [{"literal":"X"}, {"literal":"O"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$6"], "postprocess": id},
    {"name": "instr_reg_reg$string$7", "symbols": [{"literal":"B"}, {"literal":"I"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg", "symbols": ["instr_reg_reg$string$7"], "postprocess": id},
    {"name": "instr_reg_int16$string$1", "symbols": [{"literal":"C"}, {"literal":"M"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int16", "symbols": ["instr_reg_int16$string$1"], "postprocess": id},
    {"name": "instr_reg_int16$string$2", "symbols": [{"literal":"C"}, {"literal":"M"}, {"literal":"P"}, {"literal":"N"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int16", "symbols": ["instr_reg_int16$string$2"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$1", "symbols": [{"literal":"A"}, {"literal":"D"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$1"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$2", "symbols": [{"literal":"S"}, {"literal":"U"}, {"literal":"B"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$2"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$3", "symbols": [{"literal":"D"}, {"literal":"I"}, {"literal":"V"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$3"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$4", "symbols": [{"literal":"M"}, {"literal":"U"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$4"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$5", "symbols": [{"literal":"S"}, {"literal":"H"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$5"], "postprocess": id},
    {"name": "instr_reg_reg_reg$string$6", "symbols": [{"literal":"S"}, {"literal":"H"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_reg", "symbols": ["instr_reg_reg_reg$string$6"], "postprocess": id},
    {"name": "instr_reg_int8_reg$string$1", "symbols": [{"literal":"A"}, {"literal":"D"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int8_reg", "symbols": ["instr_reg_int8_reg$string$1"], "postprocess": id},
    {"name": "instr_reg_int8_reg$string$2", "symbols": [{"literal":"S"}, {"literal":"U"}, {"literal":"B"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int8_reg", "symbols": ["instr_reg_int8_reg$string$2"], "postprocess": id},
    {"name": "instr_reg_int8_reg$string$3", "symbols": [{"literal":"D"}, {"literal":"I"}, {"literal":"V"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int8_reg", "symbols": ["instr_reg_int8_reg$string$3"], "postprocess": id},
    {"name": "instr_reg_int8_reg$string$4", "symbols": [{"literal":"M"}, {"literal":"U"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_int8_reg", "symbols": ["instr_reg_int8_reg$string$4"], "postprocess": id},
    {"name": "instr_reg_reg_uint8$string$1", "symbols": [{"literal":"S"}, {"literal":"H"}, {"literal":"L"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_uint8", "symbols": ["instr_reg_reg_uint8$string$1"], "postprocess": id},
    {"name": "instr_reg_reg_uint8$string$2", "symbols": [{"literal":"S"}, {"literal":"H"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_reg_uint8", "symbols": ["instr_reg_reg_uint8$string$2"], "postprocess": id},
    {"name": "instr_reg_list$string$1", "symbols": [{"literal":"P"}, {"literal":"U"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_list", "symbols": ["instr_reg_list$string$1"], "postprocess": id},
    {"name": "instr_reg_list$string$2", "symbols": [{"literal":"P"}, {"literal":"O"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "instr_reg_list", "symbols": ["instr_reg_list$string$2"], "postprocess": id},
    {"name": "addr", "symbols": [{"literal":"["}, "uint16", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: 0 } }},
    {"name": "addr", "symbols": [{"literal":"["}, "reg", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: 0 } }},
    {"name": "addr", "symbols": [{"literal":"["}, "uint8", {"literal":","}, "__", "int8", {"literal":"]"}], "postprocess":  (d, l, reject) => {
            if (d[1] + d[4] < 0) {
                return reject;
            }
            return { addr: d[1], offset: d[4] };
        } },
    {"name": "addr", "symbols": [{"literal":"["}, "reg", {"literal":","}, "__", "int8", {"literal":"]"}], "postprocess": d => { return { addr: d[1], offset: d[4] } }},
    {"name": "label$ebnf$1", "symbols": []},
    {"name": "label$ebnf$1", "symbols": ["label$ebnf$1", /[A-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "label", "symbols": [{"literal":"."}, /[A-Z]/, "label$ebnf$1"], "postprocess": d => { return { label: "." + d[1] + d[2].join("") } }},
    {"name": "label$ebnf$2", "symbols": []},
    {"name": "label$ebnf$2", "symbols": ["label$ebnf$2", /[A-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "label", "symbols": [/[A-Z]/, "label$ebnf$2"], "postprocess": d => { return { label: d[0] + d[1].join("") } }},
    {"name": "regs$ebnf$1$subexpression$1", "symbols": ["reg", "__"]},
    {"name": "regs$ebnf$1", "symbols": ["regs$ebnf$1$subexpression$1"]},
    {"name": "regs$ebnf$1$subexpression$2", "symbols": ["reg", "__"]},
    {"name": "regs$ebnf$1", "symbols": ["regs$ebnf$1", "regs$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "regs", "symbols": [{"literal":"{"}, "__", "regs$ebnf$1", {"literal":"}"}], "postprocess":  (d, l, reject) => {
            if (d[2].length > 5) {
                return reject;
            }
            return { reglist: d[2].map(r => r[0].reg) };
        } },
    {"name": "reg", "symbols": [{"literal":"$"}, "reg_id"], "postprocess": d => { return { reg: parseInt(d[1][0], 10) } }},
    {"name": "reg_id", "symbols": [{"literal":"0"}]},
    {"name": "reg_id", "symbols": [{"literal":"1"}]},
    {"name": "reg_id", "symbols": [{"literal":"2"}]},
    {"name": "reg_id", "symbols": [{"literal":"3"}]},
    {"name": "reg_id", "symbols": [{"literal":"4"}]},
    {"name": "reg_id", "symbols": [{"literal":"5"}]},
    {"name": "reg_id", "symbols": [{"literal":"6"}]},
    {"name": "reg_id", "symbols": [{"literal":"7"}]},
    {"name": "reg_id", "symbols": [{"literal":"8"}]},
    {"name": "reg_id", "symbols": [{"literal":"9"}]},
    {"name": "reg_id$string$1", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$1"]},
    {"name": "reg_id$string$2", "symbols": [{"literal":"1"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$2"]},
    {"name": "reg_id$string$3", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$3"]},
    {"name": "reg_id$string$4", "symbols": [{"literal":"1"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$4"]},
    {"name": "reg_id$string$5", "symbols": [{"literal":"1"}, {"literal":"4"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$5"]},
    {"name": "reg_id$string$6", "symbols": [{"literal":"1"}, {"literal":"5"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reg_id", "symbols": ["reg_id$string$6"]},
    {"name": "int8", "symbols": ["int"], "postprocess":  (d, l, reject) => {
            if (d[0] < -128 || d[0] > 127) {
                return reject;
            }
            return d[0];
        } },
    {"name": "int16", "symbols": ["int"], "postprocess":  (d, l, reject) => {
            if (d[0] < -32768 || d[0] > 32767) {
                return reject;
            }
            return d[0];
        } },
    {"name": "uint8", "symbols": ["uint"], "postprocess":  (d, l, reject) => {
            if (d[0] < 0 || d[0] > 255) {
                return reject;
            }
            return d[0];
        } },
    {"name": "uint16", "symbols": ["uint"], "postprocess":  (d, l, reject) => {
            if (d[0] < 0 || d[0] > 65535) {
                return reject;
            }
            return d[0];
        } },
    {"name": "uint", "symbols": ["sum"], "postprocess": id},
    {"name": "int", "symbols": ["sum"], "postprocess": id},
    {"name": "sum$string$1", "symbols": [{"literal":" "}, {"literal":"+"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sum", "symbols": ["sum", "sum$string$1", "product"], "postprocess": d => d[0] + d[2]},
    {"name": "sum$string$2", "symbols": [{"literal":" "}, {"literal":"-"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sum", "symbols": ["sum", "sum$string$2", "product"], "postprocess": d => d[0] - d[2]},
    {"name": "sum", "symbols": ["product"], "postprocess": id},
    {"name": "product$string$1", "symbols": [{"literal":" "}, {"literal":"*"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "product", "symbols": ["product", "product$string$1", "exp"], "postprocess": d => d[0] * d[2]},
    {"name": "product$string$2", "symbols": [{"literal":" "}, {"literal":"/"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "product", "symbols": ["product", "product$string$2", "exp"], "postprocess": d => Math.floor(d[0] / d[2])},
    {"name": "product", "symbols": ["exp"], "postprocess": id},
    {"name": "exp$string$1", "symbols": [{"literal":" "}, {"literal":"^"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp", "symbols": ["exp", "exp$string$1", "base_signed_int"], "postprocess": d => Math.pow(d[0], d[2])},
    {"name": "exp", "symbols": ["base_signed_int"], "postprocess": id},
    {"name": "base_signed_int", "symbols": ["base_int"], "postprocess": id},
    {"name": "base_signed_int", "symbols": [{"literal":"+"}, "base_int"], "postprocess": d => d[1]},
    {"name": "base_signed_int", "symbols": [{"literal":"-"}, "base_int"], "postprocess": d => -d[1]},
    {"name": "base_int", "symbols": [/[0-9]/], "postprocess": d => parseInt(d, 10)},
    {"name": "base_int", "symbols": ["base_int", /[0-9]/], "postprocess": d => parseInt(d[0] + d[1], 10)},
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

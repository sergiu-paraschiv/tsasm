main -> segment_w:*               {% id %}


segment_w -> _ __n                {% d => null %}
           | _ segment _ __n      {% d => d[1] %}

segment -> instr                  {% id %}
         | label ":" __ instr     {% d => { return { label: d[0].label, op: d[3] } } %}
         | dir                    {% id %}
         | label ":" __ dir       {% d => { return { label: d[0].label, op: d[3] } } %}

dir -> ".asciiz" __ "'" .:* "'"   {% d => [ d[0], d[3].join("") ] %}


instr -> instr_no_op                             {% d => [ d[0] ] %}
       | instr_1_reg    __ reg                   {% d => [ d[0], d[2] ] %}
       | instr_1_label  __ label                 {% d => [ d[0], d[2] ] %}
       | instr_2_reg    __ reg  __ reg           {% d => [ d[0], d[2], d[4] ] %}
       | instr_3_reg    __ reg  __ reg  __ reg   {% d => [ d[0], d[2], d[4], d[6] ] %}
       | instr_reg_list __ regs                  {% d => [ d[0], d[2] ] %}
       | "LOAD"         __ reg  __ int16         {% d => [ d[0], d[2], d[4] ] %}
       | "LOAD"         __ reg  __ addr          {% d => [ d[0], d[2], d[4] ] %}
       | "SAVE"         __ addr __ int8          {% d => [ d[0], d[2], d[4] ] %}
       | "SAVE"         __ addr __ reg           {% d => [ d[0], d[2], d[4] ] %}


instr_no_op -> "HALT"    {% id %}
             | "RET"     {% id %}

instr_1_label -> "JMP"   {% id %}
               | "JEQ"   {% id %}
               | "JNEQ"  {% id %}
               | "JGT"   {% id %}
               | "JLT"   {% id %}
               | "JGTE"  {% id %}
               | "JLTE"  {% id %}
               | "PUTS"  {% id %}
               | "CALL"  {% id %}

instr_1_reg -> "JMP"     {% id %}
             | "JMPF"    {% id %}
             | "JMPB"    {% id %}
             | "JEQ"     {% id %}
             | "JNEQ"    {% id %}
             | "JGT"     {% id %}
             | "JLT"     {% id %}
             | "JGTE"    {% id %}
             | "JLTE"    {% id %}
             | "PUSH"    {% id %}
             | "POP"     {% id %}

instr_2_reg -> "CMP"     {% id %}

instr_3_reg -> "ADD"     {% id %}
             | "SUB"     {% id %}
             | "DIV"     {% id %}
             | "MUL"     {% id %}

instr_reg_list -> "PUSH" {% id %}
                | "POP"  {% id %}


addr -> "[" uint16 "]"              {% d => { return { addr: d[1], offset: 0 } } %}
      | "[" reg "]"                 {% d => { return { addr: d[1], offset: 0 } } %}
      | "[" uint8 "," __ int8 "]"   {% (d, l, reject) => {
                                        if (d[1] + d[4] < 0) {
                                            return reject;
                                        }
                                        return { addr: d[1], offset: d[4] };
                                    } %}
      | "[" reg "," __ int8 "]"     {% d => { return { addr: d[1], offset: d[4] } } %}


label -> "." [A-Z] [A-Z0-9]:*       {% d => { return { label: "." + d[1] + d[2].join("") } } %}
       | [A-Z] [A-Z0-9]:*           {% d => { return { label: d[0] + d[1].join("") } } %}

regs -> "{" __ (reg __):+ "}"       {% (d, l, reject) => {
                                        if (d[2].length > 5) {
                                            return reject;
                                        }
                                        return { reglist: d[2].map(r => r[0].reg) };
                                    } %}


reg    -> "$" reg_id                {% d => { return { reg: parseInt(d[1][0], 10) } } %}
reg_id -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15"


int8    -> int                      {% (d, l, reject) => {
                                        if (d[0] < -128 || d[0] > 127) {
                                            return reject;
                                        }
                                        return d[0];
                                    } %}

int16   -> int                      {% (d, l, reject) => {
                                        if (d[0] < -32768 || d[0] > 32767) {
                                            return reject;
                                        }
                                        return d[0];
                                    } %}
uint8   -> uint                     {% (d, l, reject) => {
                                        if (d[0] < 0 || d[0] > 255) {
                                            return reject;
                                        }
                                        return d[0];
                                    } %}
uint16  -> uint                     {% (d, l, reject) => {
                                        if (d[0] < 0 || d[0] > 65535) {
                                            return reject;
                                        }
                                        return d[0];
                                    } %}

uint    -> base_int                 {% id %}
int     -> sum                      {% id %}

sum     -> sum " + " product        {% d => d[0] + d[2] %}
         | sum " - " product        {% d => d[0] - d[2] %}
         | product                  {% id %}

product -> product " * " exp        {% d => d[0] * d[2] %}
         | product " / " exp        {% d => Math.floor(d[0] / d[2]) %}
         | exp                      {% id %}

exp     -> exp " ^ " base_signed_int       {% d => Math.pow(d[0], d[2]) %}
         | base_signed_int                 {% id %}

base_signed_int -> base_int         {% id %}
                 | "+" base_int     {% d => d[1] %}
                 | "-" base_int     {% d => -d[1] %}

base_int  -> [0-9]                  {% d => parseInt(d, 10) %}
           | base_int [0-9]         {% d => parseInt(d[0] + d[1], 10) %}


_     -> null | _ [" "\t]           {% d => null %}
__    -> [" "\t] | __ [" "\t]       {% d => null %}
__n   -> [\n]                       {% d => null %}

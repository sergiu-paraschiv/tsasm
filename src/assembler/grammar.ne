main -> segment_w:*               {% id %}

segment_w -> _ __n                {% d => null %}
           | _ segment _ __n      {% d => d[1] %}

segment -> instr                  {% id %}
         | label ":" __ instr     {% d => { return { label: d[0], op: d[3] } } %}
         | dir                    {% id %}

dir -> ".asciiz" __ "'" .:+ "'"      {% d => [ d[0], d[3].join("") ] %}

instr -> instr_no_op                          {% d => [ d[0] ] %}
       | instr_1_reg   __ reg                 {% d => [ d[0], d[2] ] %}
       | instr_1_label __ label               {% d => [ d[0], d[2] ] %}
       | instr_2_reg   __ reg __ reg          {% d => [ d[0], d[2], d[4] ] %}
       | instr_3_reg   __ reg __ reg __ reg   {% d => [ d[0], d[2], d[4], d[6] ] %}
       | "LOAD"        __ reg __ int          {% d => [ d[0], d[2], d[4] ] %}


instr_no_op -> "HALT"    {% id %}

instr_1_label -> "JMP"   {% id %}
               | "JEQ"   {% id %}
               | "JNEQ"  {% id %}
               | "JGT"   {% id %}
               | "JLT"   {% id %}
               | "JGTE"  {% id %}
               | "JLTE"  {% id %}

instr_1_reg -> "JMP"     {% id %}
             | "JMPF"    {% id %}
             | "JMPB"    {% id %}
             | "JEQ"     {% id %}
             | "JNEQ"    {% id %}
             | "JGT"     {% id %}
             | "JLT"     {% id %}
             | "JGTE"    {% id %}
             | "JLTE"    {% id %}

instr_2_reg -> "CMP"     {% id %}

instr_3_reg -> "ADD"     {% id %}
             | "SUB"     {% id %}
             | "DIV"     {% id %}
             | "MUL"     {% id %}


label -> "." [A-Z] [A-Z0-9]:*       {% d => "." + d[1] + d[2].join("") %}
       | [A-Z] [A-Z0-9]:*           {% d => d[0] + d[1].join("") %}

reg   -> "$" int                    {% (d, l, reject) => {
                                        if (d[1] > 15) {
                                            return reject;
                                        }

                                        return d[1];
                                    } %}

int   -> [0-9]                      {% d => parseInt(d, 10) %}
       | int [0-9]                  {% d => parseInt(d[0] + d[1], 10) %}

_     -> null | _ [" "\t]           {% d => null %}
__    -> [" "\t] | __ [" "\t]       {% d => null %}
__n   -> [\n]                       {% d => null %}

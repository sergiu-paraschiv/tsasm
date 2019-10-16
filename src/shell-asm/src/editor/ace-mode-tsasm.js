ace.define('ace/mode/tsasm', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/text_highlight_rules'], (acequire, exports) => {
    const oop = acequire('ace/lib/oop');
    const TextMode = acequire('ace/mode/text').Mode;
    const TextHighlightRules = acequire('ace/mode/text_highlight_rules').TextHighlightRules;

    const TSAssemblyHighlightRules = function CustomHighlightRules() {
        this.$rules = {
            start: [
                {
                    token: 'keyword.control.assembly',
                    regex: /(HALT|LOAD|ADD|SUB|MUL|DIV|JMP|JMPF|JMPB|CMP|JEQ|JNEQ|JGT|JLT|JGTE|JLTE|\.asciiz|PUTS)/,
                    caseInsensitive: false
                },

                {
                    token: 'support.function.label.assembly',
                    regex: /[A-Z][A-Z0-9]*:/,
                    caseInsensitive: false
                },

                {
                    token: 'variable.parameter.register.assembly',
                    regex: /\$[0-9]+/
                },

                {
                    token: 'constant.character.decimal.assembly',
                    regex: '\\b[0-9]+\\b'
                },

                {
                    token: 'constant.character.string.assembly',
                    regex: /\'.*\'/
                },

                {
                    token: 'support.function.label-parameter.assembly',
                    regex: /[A-Z][A-Z0-9]*/
                }
            ]
        };


        this.normalizeRules();
    };

    oop.inherits(TSAssemblyHighlightRules, TextHighlightRules);

    const Mode = function () {
        this.HighlightRules = TSAssemblyHighlightRules;
    };

    oop.inherits(Mode, TextMode);

    exports.Mode = Mode;
});

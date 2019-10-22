export const INIT_PROGRAM = `
.asciiz '----------'
DONE: .asciiz 'Done.'

        LOAD $1 50 ; a comment
        LOAD $2 10 ; another comment
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1

;
; this comment 
; is on multiple lines :)
; and contains START SUB $1 ADD CMP
;
        
START:  SUB  $1 $1 $2
        ADD  $11 $11 $12
        CMP  $1 $10
        
        PUSH $1
        
        JEQ  END
        JMP  START
        
END:    PUTS DONE
        HALT
.asciiz '----------'
`;
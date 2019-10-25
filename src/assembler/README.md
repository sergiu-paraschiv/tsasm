# Instructions

## HALT
Stops execution of Program.

## LOAD

#### LOAD $1 500
Load int16 to register

```
LOAD $1 500
LOAD $15 500
LOAD $15 100 + 400
```

#### LOAD $1 [500]
Load value at memory address 500 to register

```
LOAD $1 [500]       ; [uint16]
LOAD $1 [255, 127]  ; [uint8 + int8]
```

#### LOAD $1 [$2]
Load value at memory address pointed at by register to register

```
LOAD $1 [$2]        ; [reg value of $2 is int32]
```

## ADD, SUB, MUL, DIV

#### ADD | SUB | MUL | DIV $1 $2 $3
Adds | Subtracts | Multiplies | Divides values of registers $2 and $3 and saves the result to $1

#### ADD | SUB | MUL | DIV $1 127 $3
Adds | Subtracts | Multiplies | Divides values of register $2 and int8 and saves the result to $1

## INC, DEC

#### INC | DEC $1
Increments | Decrements register $1

## CMP

#### CMP $1 $2
Subtracts value of register $2 from value of register $1
and sets `equal` and `negative` flags accordingly

#### CMP $1 100
Subtracts int16 from value of register $1
and sets `equal` and `negative` flags accordingly

## CMPN

#### CMPN $1 $2
Adds value of register $2 to value of register $1
and sets `equal` and `negative` flags accordingly

#### CMPN $1 100
Adds int16 to value of register $1
and sets `equal` and `negative` flags accordingly

## JMP

#### JMP $1
Sets PC to value of register $1.
PC is stored in register $15

#### JMPL LABEL
Sets PC to instruction index of label LABEL
PC is stored in register $15

## JMPF, JMPB

#### JMPF | JMPB $1
Adds | Subtracts value of register $1 to | from PC
PC is stored in register $15

## JEQ, JNEQ, JGT, JGT, JLT, JGTE, JLET

#### JEQ | JNEQ | JGT | JGT | JLT | JGTE | JLET $1
Sets PC to value of register $1 **IF** condition is met.
Condition is given by the `equal` and `negative` flags.
PC is stored in register $15

#### JEQ | JNEQ | JGT | JGT | JLT | JGTE | JLET LABEL
Sets PC to instruction index of label LABEL **IF** condition is met.
Condition is given by the `equal` and `negative` flags.
PC is stored in register $15

## SAVE

#### SAVE [0] 10
Sets memory at index 0 (uint16) to 10 (int8)

#### SAVE [255, 127] 10
Sets memory at index 255 + 127 (uint8 + int8) to 10 (int8)

#### SAVE [$1] 10
Sets memory at index [value of $1] (int32) to 10 (int8)

#### SAVE [$1, -100] 10
Sets memory at index [value of $1 - 100] (int32 - int8) to 10 (int8)

#### SAVE [500] $2
Sets memory at index 500 (uint16) to least significant 8 bytes of register $2

#### SAVE [255, -128] $2
Sets memory at index 255 - 128 (uint8 + int8) to least significant 8 bytes of register $2

#### SAVE [$1] $2
Sets memory at index [value of $1] (int32) to least significant 8 bytes of register $2

#### SAVE [$1, -127] $2
Sets memory at index [value of $1 - 127] (int32 + int8) to least significant 8 bytes of register $2

## PUSH

#### PUSH $1
Pushes value of $1 (int32) to stack (SP is decremented by 4 [bytes])
SP is stored in register $13

#### PUSH { $11 $10 $9 $8 $7 }
Pushes values of ordered list of registers (int32) to stack (SP is decremented by X [bytes], where X is the number of pushed registers)
SP is stored in register $13

## POP

#### POP $1
Pops value from stack (SP is incremented by 4 [bytes]) to $1 (int32) 
SP is stored in register $13

#### POP { $11 $10 $9 $8 $7 }
Pops values from stack (SP is decremented by X [bytes], where X is the number of pushed registers) to ordered list of registers (int32)
SP is stored in register $13

## CALL

#### CALL LABEL
Sets PC to instruction index of label LABEL
Sets LR to current instruction index
PC is stored in register $15
LR is stored in register $14

## RET

Sets PC to LR
PC is stored in register $15
LR is stored in register $14

## MOV

#### MOV $1 $2
Copies value of register $2 to register $1


## AND, OR, XOR, BIC

#### AND | OR | XOR | BIC $1 $2
Performs logical operation $1 AND | OR | XOR | BIC $2, saves result to $1

#### AND | OR | XOR | BIC $1 10
Performs logical operation $1 AND | OR | XOR | BIC 10 (uint16), saves result to $1

## NOT

#### NOT $1
Performs negation of value of register $1, saves result to $1

## SHL, SHR

### SHL | SHR $1 $2 $3
Shifts value of register $2 left | right by value of register $3 positions, saves result to $1

### SHL | SHR $1 $2 1
Shifts value of register $2 left | right by 1 (int8) positions, saves result to $1
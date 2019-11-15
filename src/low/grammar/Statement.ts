import { VarDeclaration } from './VarDeclaration';
import { VarAssignment } from './VarAssignment';
import { IfStatement } from './IfStatement';
import { Block } from './Block';
import { EndOfLine } from './EndOfLine';
import { Comment } from './Comment';


export type StatementList = Statement[];

export type Statement =
    Comment
    | VarDeclaration
    | VarAssignment
    | IfStatement
    | Block
    | EndOfLine;

export {
    VarDeclaration,
    VarAssignment,
    IfStatement,
    Block,
    EndOfLine,
    Comment
}
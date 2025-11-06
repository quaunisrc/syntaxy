import { Klass, LexicalEditor, LexicalNode } from 'lexical';
import { SyntaxyEditorBase } from './SyntaxyTypes';
import { SyntaxySignal } from './SyntaxySignal';

// eslint-disable-next-line
type BaseCommands = Record<string, (...args: any[]) => any>;

type BaseState = Record<string, SyntaxySignal<unknown>>;

export abstract class SyntaxyExtension<
  TName extends string,
  TCommands extends BaseCommands | unknown = unknown,
  TState extends BaseState | unknown = unknown,
> {
  abstract readonly name: TName;

  readonly nodes?: ReadonlyArray<Klass<LexicalNode>>;

  addCommands?(
    editor: SyntaxyEditorBase,
    lexicalEditor: LexicalEditor,
  ): TCommands;
  addState?(editor: SyntaxyEditorBase, lexicalEditor: LexicalEditor): TState;
  register?(lexicalEditor: LexicalEditor): (() => void) | void;
}

export type AnyExtensions = SyntaxyExtension<string, unknown, unknown>[];

export type UnionCommands<T extends AnyExtensions> = {
  [E in T[number] as E['name']]: E extends SyntaxyExtension<
    string,
    infer C,
    unknown
  >
    ? C
    : unknown;
};

export type UnionState<T extends AnyExtensions> = {
  [E in T[number] as E['name']]: E extends SyntaxyExtension<
    string,
    unknown,
    infer S
  >
    ? S
    : unknown;
};

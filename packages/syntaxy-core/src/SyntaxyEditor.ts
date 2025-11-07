import { createEditor, LexicalEditor } from 'lexical';
import { AnyExtensions, UnionCommands, UnionState } from './SyntaxyExtension';
import { SyntaxyEditorBase } from './SyntaxyTypes';
import { registerRichText } from '@lexical/rich-text';

type EditorEventCallback = () => void;

export class SyntaxyEditor<TExtensions extends AnyExtensions>
  implements SyntaxyEditorBase
{
  #lexicalEditor: LexicalEditor;
  #lexicalUnregisterCallbacks: (() => void)[] = [];
  #extensions: TExtensions;
  #listeners: Record<string, EditorEventCallback[]> = {};

  readonly commands: UnionCommands<TExtensions>;
  readonly state: UnionState<TExtensions>;

  constructor(options: { extensions: TExtensions }) {
    this.#extensions = options.extensions;

    const lexicalNodes = this.#extensions.flatMap((ext) => ext.nodes || []);
    this.#lexicalEditor = createEditor({
      namespace: 'SyntaxyEditor',
      nodes: lexicalNodes,
      onError: console.error,
    });

    const unregisterRichText = registerRichText(this.#lexicalEditor);
    if (unregisterRichText) {
      this.#lexicalUnregisterCallbacks.push(unregisterRichText);
    }

    // eslint-disable-next-line
    const commands = {} as any;
    // eslint-disable-next-line
    const state = {} as any;

    for (const ext of this.#extensions) {
      if (ext.addCommands) {
        commands[ext.name] = ext.addCommands(this, this.#lexicalEditor);
      }

      if (ext.addState) {
        state[ext.name] = ext.addState(this, this.#lexicalEditor);
      }

      if (ext.register) {
        const unregister = ext.register(this.#lexicalEditor);

        if (unregister) {
          this.#lexicalUnregisterCallbacks.push(unregister);
        }
      }
    }

    this.commands = commands;
    this.state = state;

    this.#lexicalEditor.registerUpdateListener(() => {
      this.#emit('update');
    });
  }

  #emit(event: string) {
    this.#listeners[event]?.forEach((cb) => cb());
  }

  public on(event: 'update', callback: EditorEventCallback) {
    this.#listeners[event] = this.#listeners[event] || [];
    this.#listeners[event].push(callback);
  }

  public off(event: 'update', callback: EditorEventCallback) {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (cb) => cb !== callback,
    );
  }

  public mount(element: HTMLElement) {
    this.#lexicalEditor.setRootElement(element);
  }

  public destroy() {
    this.#lexicalUnregisterCallbacks.forEach((cb) => cb());
    this.#listeners = {};
    this.#lexicalEditor.setRootElement(null);
  }
}

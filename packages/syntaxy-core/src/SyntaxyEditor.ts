import { createEditor, LexicalEditor } from 'lexical';
import { AnyExtensions, UnionCommands, UnionState } from './SyntaxyExtension';
import { SyntaxyEditorBase } from './SyntaxyTypes';

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
      nodes: lexicalNodes,
    });

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

    this.#lexicalEditor.registerUpdateListener(
      ({ dirtyElements, dirtyLeaves }) => {
        this.#emit('update');

        const selectionChanged =
          dirtyElements.has('root') || dirtyLeaves.size > 0;

        if (selectionChanged) {
          this.#emit('selectionUpdate');
        }
      },
    );
  }

  #emit(event: string) {
    this.#listeners[event]?.forEach((cb) => cb());
  }

  public on(
    event: 'update' | 'selectionUpdate' | string,
    callback: EditorEventCallback,
  ) {
    this.#listeners[event] = this.#listeners[event] || [];
    this.#listeners[event].push(callback);
  }

  public off(
    event: 'update' | 'selectionUpdate' | string,
    callback: EditorEventCallback,
  ) {
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

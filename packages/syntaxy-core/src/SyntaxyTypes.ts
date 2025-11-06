export type EditorEventCallback = () => void;

export interface SyntaxyEditorBase {
  /**
   * Listen for an event from the editor.
   */
  on(
    event: 'update' | 'selectionUpdate' | string,
    callback: EditorEventCallback,
  ): void;

  /**
   * Stop listening for an event.
   */
  off(
    event: 'update' | 'selectionUpdate' | string,
    callback: EditorEventCallback,
  ): void;
}

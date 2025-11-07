import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from 'lexical';
import {
  SyntaxyExtension,
  SyntaxySignal,
  SyntaxyEditorBase,
} from '@syntaxy/core';

type BoldCommands = {
  toggleBold: () => void;
};

type BoldState = {
  isBold: SyntaxySignal<boolean>;
};

export class SyntaxyExtensionBold extends SyntaxyExtension<
  'bold',
  BoldCommands,
  BoldState
> {
  public readonly name = 'bold';

  addCommands(
    _editor: SyntaxyEditorBase,
    lexicalEditor: LexicalEditor,
  ): BoldCommands {
    return {
      toggleBold: () => {
        // We use the 'lexicalEditor' to dispatch a Lexical command
        lexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      },
    };
  }

  addState(editor: SyntaxyEditorBase, lexicalEditor: LexicalEditor): BoldState {
    const isBoldSignal = new SyntaxySignal(false);

    editor.on('update', () => {
      lexicalEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          isBoldSignal.set(selection.hasFormat('bold'));
        }
      });
    });

    return {
      isBold: isBoldSignal,
    };
  }
}

import { SyntaxyEditor } from '@syntaxy/core';
import { SyntaxyExtensionBold } from '@syntaxy/extension-bold';

const editorEl = document.querySelector('.editor') as HTMLElement;

const editor = new SyntaxyEditor({ extensions: [new SyntaxyExtensionBold()] });

editor.mount(editorEl);

const boldBtnEl = document.querySelector('.btn--bold') as HTMLButtonElement;

boldBtnEl.addEventListener('click', () => {
  editor.commands.bold.toggleBold();
});

editor.state.bold.isBold.subscribe((val) => {
  boldBtnEl.textContent = val ? 'BOLD' : 'NOT BOLD';
});

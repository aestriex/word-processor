import { Node, mergeAttributes } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      insertPageBreak: () => ReturnType;
    };
  }
}

export const PageBreakNode = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  parseHTML() {
    return [{ tag: 'div[data-page-break]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        class: 'page-break-marker',
        contenteditable: 'false',
      }),
    ];
  },

  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ tr, dispatch, state }) => {
          const pageBreakType = state.schema.nodes.pageBreak;
          const paragraphType = state.schema.nodes.paragraph;
          const { $from } = state.selection;

          let newTr = tr;
          let insertPos: number;

          const atBlockStart = $from.parentOffset === 0;
          const atBlockEnd = $from.parentOffset === $from.parent.content.size;

          if (atBlockStart) {
            // Cursor already sits at the very start of its block — insert
            // immediately before it, no splitting needed.
            insertPos = $from.before();
          } else if (atBlockEnd) {
            // Cursor already sits at the very end of its block — insert
            // immediately after it, no splitting needed.
            insertPos = $from.after();
          } else {
            // Cursor is genuinely mid-text. Explicitly split the block
            // ourselves here, rather than inserting a block-level node at an
            // inline position and letting ProseMirror's internal fitting
            // logic decide how to restructure things — that implicit
            // restructuring is what caused the break/paragraph ordering bug.
            const splitPos = $from.pos;
            newTr = newTr.split(splitPos);
            insertPos = newTr.mapping.map(splitPos);
          }

          const pageBreakNode = pageBreakType.create();
          newTr = newTr.insert(insertPos, pageBreakNode);
          const afterPos = insertPos + pageBreakNode.nodeSize;

          const resolvedAfter = newTr.doc.resolve(afterPos);
          const nodeAfter = resolvedAfter.nodeAfter;

          let selectionPos: number;
          if (nodeAfter && nodeAfter.isTextblock) {
            selectionPos = afterPos + 1;
          } else {
            const paragraph = paragraphType.create();
            newTr = newTr.insert(afterPos, paragraph);
            selectionPos = afterPos + 1;
          }

          const selection = TextSelection.create(newTr.doc, selectionPos);
          newTr = newTr.setSelection(selection);

          if (dispatch) dispatch(newTr);
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.insertPageBreak(),
    };
  },
});

import { Extension } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraphExtras: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
      increaseIndent: () => ReturnType;
      decreaseIndent: () => ReturnType;
    };
  }
}

const MAX_INDENT = 8;
const INDENT_STEP_PX = 32;

const lineHeightAttribute = {
  lineHeight: {
    default: null,
    parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
    renderHTML: (attributes: { lineHeight?: string | null }) => {
      if (!attributes.lineHeight) return {};
      return { style: `line-height: ${attributes.lineHeight}` };
    },
  },
};

const indentAttribute = {
  indent: {
    default: 0,
    parseHTML: (element: HTMLElement) => {
      const margin = parseInt(element.style.marginLeft || '0', 10);
      return Math.round(margin / INDENT_STEP_PX);
    },
    renderHTML: (attributes: { indent?: number }) => {
      if (!attributes.indent) return {};
      return { style: `margin-left: ${attributes.indent * INDENT_STEP_PX}px` };
    },
  },
};

const directionalIndentAttributes = {
  indentLeft: {
    default: 0,
    parseHTML: (element: HTMLElement) => parseInt(element.style.paddingLeft || '0', 10),
    renderHTML: (attributes: { indentLeft?: number }) => {
      if (!attributes.indentLeft) return {};
      return { style: `padding-left: ${attributes.indentLeft}px` };
    },
  },
  indentRight: {
    default: 0,
    parseHTML: (element: HTMLElement) => parseInt(element.style.paddingRight || '0', 10),
    renderHTML: (attributes: { indentRight?: number }) => {
      if (!attributes.indentRight) return {};
      return { style: `padding-right: ${attributes.indentRight}px` };
    },
  },
};

export const ParagraphWithExtras = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...lineHeightAttribute,
      ...indentAttribute,
      ...directionalIndentAttributes,
      ...spacingAttributes,
    };
  },
});

export const HeadingWithExtras = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...lineHeightAttribute,
    };
  },
});

const spacingAttributes = {
  spaceBefore: {
    default: 0,
    parseHTML: (element: HTMLElement) => parseInt(element.style.marginTop || '0', 10),
    renderHTML: (attributes: { spaceBefore?: number }) => {
      if (!attributes.spaceBefore) return {};
      return { style: `margin-top: ${attributes.spaceBefore}px` };
    },
  },
  spaceAfter: {
    default: 0,
    parseHTML: (element: HTMLElement) => parseInt(element.style.marginBottom || '0', 10),
    renderHTML: (attributes: { spaceAfter?: number }) => {
      if (!attributes.spaceAfter) return {};
      return { style: `margin-bottom: ${attributes.spaceAfter}px` };
    },
  },
};

export const ParagraphExtraCommands = Extension.create({
  name: 'paragraphExtraCommands',

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }: { commands: any }) =>
          commands.focus() &&
          ['paragraph', 'heading'].every((type: string) => commands.updateAttributes(type, { lineHeight })),

      unsetLineHeight:
        () =>
        ({ commands }: { commands: any }) =>
          commands.focus() &&
          ['paragraph', 'heading'].every((type: string) => commands.resetAttributes(type, 'lineHeight')),

      increaseIndent:
        () =>
        ({ tr, state, dispatch }: { tr: any; state: any; dispatch: any }) => {
          const { $from } = state.selection;
          const pos = $from.before($from.depth);
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== 'paragraph') return false;

          const current = node.attrs.indent ?? 0;
          if (current >= MAX_INDENT) return false;

          if (dispatch) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: current + 1 });
            dispatch(tr);
          }
          return true;
        },

      decreaseIndent:
        () =>
        ({ tr, state, dispatch }: { tr: any; state: any; dispatch: any }) => {
          const { $from } = state.selection;
          const pos = $from.before($from.depth);
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== 'paragraph') return false;

          const current = node.attrs.indent ?? 0;
          if (current <= 0) return false;

          if (dispatch) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: current - 1 });
            dispatch(tr);
          }
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-]': () => this.editor.commands.increaseIndent(),
      'Mod-[': () => this.editor.commands.decreaseIndent(),
      Backspace: () => {
        const { state } = this.editor;
        const { $from, empty } = state.selection;

        if (!empty || $from.parentOffset !== 0) return false;

        const node = $from.parent;
        if (node.type.name !== 'paragraph' || !node.attrs.indent) return false;

        return this.editor.commands.decreaseIndent();
      },
      'Mod-\\': () => {
        this.editor.chain().focus().unsetAllMarks()
          .updateAttributes('paragraph', { lineHeight: null, indent: 0, textAlign: null })
          .updateAttributes('heading', { lineHeight: null, textAlign: null })
          .run();
        return true;
      },
    };
  },
});

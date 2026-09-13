import { Extension } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

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

export const ParagraphWithLineHeight = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...lineHeightAttribute,
    };
  },
});

export const HeadingWithLineHeight = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...lineHeightAttribute,
    };
  },
});

export const LineHeightCommands = Extension.create({
  name: 'lineHeightCommands',

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
    };
  },
});

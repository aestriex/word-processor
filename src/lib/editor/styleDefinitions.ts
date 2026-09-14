export interface StyleDefinition {
  id: string;
  label: string;
  /** How this style previews in the dropdown list itself. */
  previewClassName?: string;
  apply: (editor: import('@tiptap/core').Editor) => void;
}

export const STYLE_DEFINITIONS: StyleDefinition[] = [
  {
    id: 'normal',
    label: 'Normal Text',
    apply: (editor) => {
      editor
        .chain()
        .focus()
        .setParagraph()
        .unsetAllMarks()
        .updateAttributes('paragraph', { lineHeight: null, indent: 0, textAlign: null })
        .setFontSize('16px')
        .run();
    },
  },
  {
    id: 'heading1',
    label: 'Heading 1',
    previewClassName: 'text-2xl font-bold',
    apply: (editor) => {
      editor.chain().focus().unsetAllMarks().setHeading({ level: 1 }).run();
    },
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    previewClassName: 'text-xl font-bold',
    apply: (editor) => {
      editor.chain().focus().unsetAllMarks().setHeading({ level: 2 }).run();
    },
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    previewClassName: 'text-lg font-bold',
    apply: (editor) => {
      editor.chain().focus().unsetAllMarks().setHeading({ level: 3 }).run();
    },
  },
  {
    id: 'quote',
    label: 'Quote',
    previewClassName: 'italic',
    apply: (editor) => {
      editor.chain().focus().setParagraph().toggleItalic().run();
    },
  },
  {
    id: 'emphasis',
    label: 'Emphasis',
    previewClassName: 'italic',
    apply: (editor) => {
      editor.chain().focus().setItalic().run();
    },
  },
  {
    id: 'strong',
    label: 'Strong',
    previewClassName: 'font-bold',
    apply: (editor) => {
      editor.chain().focus().setBold().run();
    },
  },
  {
    id: 'hyperlink',
    label: 'Hyperlink',
    previewClassName: 'text-primary underline',
    apply: (editor) => {
      editor.chain().focus().setColor('var(--primary)').setUnderline().run();
    },
  },
];

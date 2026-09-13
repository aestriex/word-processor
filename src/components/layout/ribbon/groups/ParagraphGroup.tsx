import { useEditorState } from '@tiptap/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from 'lucide-react';
import { RibbonGroup } from '../../RibbonGroup';
import { RibbonIconButton } from '../RibbonIconButton';
import { useDocumentStore } from '@/lib/document/store';
import { ListStyleButton } from '../ListStyleButton';
import { LineSpacingButton } from '../LineSpacingButton';
import { IndentButtons } from '../IndentButtons';

export function ParagraphGroup() {
  const editor = useDocumentStore((s) => s.editor);

  const attrs = useEditorState({
    editor,
    selector: (ctx) => ({
      isLeft: ctx.editor?.isActive({ textAlign: 'left' }) ?? false,
      isCenter: ctx.editor?.isActive({ textAlign: 'center' }) ?? false,
      isRight: ctx.editor?.isActive({ textAlign: 'right' }) ?? false,
      isJustify: ctx.editor?.isActive({ textAlign: 'justify' }) ?? false,
      isBulletList: ctx.editor?.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
    }),
  });

  if (!editor) return null;

  return (
    <RibbonGroup>
      <RibbonIconButton
        label="Align Left"
        icon={<AlignLeft size={16} />}
        active={attrs?.isLeft}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        shortcutId='alignLeft'
      />

      <RibbonIconButton
        label="Align Center"
        icon={<AlignCenter size={16} />}
        active={attrs?.isCenter}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        shortcutId='alignCenter'
      />

      <RibbonIconButton
        label="Align Right"
        icon={<AlignRight size={16} />}
        active={attrs?.isRight}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        shortcutId='alignRight'
      />

      <RibbonIconButton
        label="Justify"
        icon={<AlignJustify size={16} />}
        active={attrs?.isJustify}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        shortcutId='alignJustify'
      />

      <LineSpacingButton editor={editor}/>


      <ListStyleButton
        editor={editor}
        label="Bullet List"
        icon={<List size={16} />}
        nodeName="unorderedList"
        shortcutId='unorderedList'
        options={[
          { value: 'disc', label: 'Disc', sample: '•' },
          { value: 'circle', label: 'Circle', sample: '○' },
          { value: 'square', label: 'Square', sample: '▪' },
        ]}
      />

      <ListStyleButton
        editor={editor}
        label="Numbered List"
        icon={<ListOrdered size={16} />}
        nodeName="orderedList"
        shortcutId='orderedList'
        options={[
          { value: 'decimal', label: 'Numbers', sample: '1.' },
          { value: 'lower-alpha', label: 'Lowercase Letters', sample: 'a.' },
          { value: 'upper-alpha', label: 'Uppercase Letters', sample: 'A.' },
          { value: 'lower-roman', label: 'Lowercase Roman', sample: 'i.' },
          { value: 'upper-roman', label: 'Uppercase Roman', sample: 'I.' },
        ]}
      />

      <IndentButtons editor={editor}/>
    </RibbonGroup>
  );
}

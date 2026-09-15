import { OrderedList } from '@tiptap/extension-list';
import { BulletList } from '@tiptap/extension-list';

export const OrderedListWithStyle = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'decimal',
        parseHTML: (element) => element.style.listStyleType || 'decimal',
        renderHTML: (attributes) => {
          if (!attributes.listStyleType) return {};
          return { style: `list-style-type: ${attributes.listStyleType}` };
        },
      },
    };
  },
});

export const UnorderedListWithStyle = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'disc',
        parseHTML: (element) => element.style.listStyleType || 'disc',
        renderHTML: (attributes) => {
          if (!attributes.listStyleType) return {};
          return { style: `list-style-type: ${attributes.listStyleType}` };
        },
      },
    };
  },
});

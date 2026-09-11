import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Node as PMNode } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import type { PageBreak } from './measurePages';
import { PAGE_GAP, DEFAULT_MARGINS } from './constants';

export const paginationPluginKey = new PluginKey('pagination');

// Builds the spacer element that visually pushes content from one page down into the
// next. This must be a real, separate DOM element (not padding on a real content node)
// so it can be independently excluded from native text selection - see notes below.
function createSpacerWidget(height: number): HTMLElement {
  const widget = document.createElement('div');
  widget.className = 'page-break-spacer';
  widget.style.height = `${height}px`;
  widget.style.pointerEvents = 'none';

  // Browsers "gap-fill" selection highlight across any vertical space between two
  // selected pieces of content, regardless of whether that space comes from a widget
  // or from padding on a real node - so the fix isn't avoiding a widget, it's making
  // sure this specific widget can never participate in a selection's paint or range.
  widget.contentEditable = 'false';
  widget.style.userSelect = 'none';
  (widget.style as unknown as { WebkitUserSelect: string }).WebkitUserSelect = 'none';
  widget.setAttribute('aria-hidden', 'true');

  return widget;
}

function buildDecorations(
  doc: PMNode,
  breaks: PageBreak[],
  pageGap: number,
  marginTop: number,
  marginBottom: number
): DecorationSet {
  const decorations = breaks.flatMap((brk) => {
    const spacerHeight = brk.leftoverSpace + marginBottom + pageGap + marginTop;
    const widget = createSpacerWidget(spacerHeight);
    const decos = [Decoration.widget(brk.pos, widget, { side: -1, key: `pagebreak-${brk.pos}` })];

    if (brk.kind === 'node') {
      decos.push(
        Decoration.node(brk.nextRange[0], brk.nextRange[1], { class: 'pagination-collapse-top' })
      );
    }
    return decos;
  });
  return DecorationSet.create(doc, decorations);
}

export interface PaginationOptions {
  pageGap: number;
  marginTop: number;
  marginBottom: number;
}

export const PaginationExtension = Extension.create<PaginationOptions>({
  name: 'pagination',

  addOptions() {
    return { pageGap: PAGE_GAP, marginTop: DEFAULT_MARGINS.top, marginBottom: DEFAULT_MARGINS.bottom };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    return [
      new Plugin({
        key: paginationPluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const meta = tr.getMeta(paginationPluginKey);
            if (meta?.breaks) {
              return buildDecorations(tr.doc, meta.breaks, options.pageGap, options.marginTop, options.marginBottom);
            }
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return paginationPluginKey.getState(state);
          },
        },
      }),
    ];
  },
});

export function setPageBreaks(view: EditorView, breaks: PageBreak[]) {
  const tr = view.state.tr.setMeta(paginationPluginKey, { breaks });
  view.dispatch(tr);
}

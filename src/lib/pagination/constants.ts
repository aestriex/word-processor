export interface PageDimensions {
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PageSetup {
  pageSize: string;
  margins: Margins;
  pageGap: number;
}

export const PAGE_SIZES: Record<string, PageDimensions> = {
  Letter: { width: 816, height: 1056 },
  Legal: { width: 816, height: 1344 },
  A4: { width: 794, height: 1123 },
};

export const PAGE_GAP = 32;
export const PAGINATION_DEBOUNCE_MS = 60;
export const FALLBACK_PAGE_SIZE = 'Letter';

export const DEFAULT_MARGINS: Margins = {
  top: 96,
  bottom: 96,
  left: 96,
  right: 96,
};

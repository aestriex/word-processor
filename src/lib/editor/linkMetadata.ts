import { invoke } from '@tauri-apps/api/core';
import { useConfigStore } from '@/lib/config/store';

export interface LinkMetadata {
  title: string | null;
  description: string | null;
  favicon: string | null;
}

const metadataCache = new Map<string, LinkMetadata | null>();

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata | null> {
  const enabled = useConfigStore.getState().config.editor.fetchLinkMetadata;
  if (!enabled) return null;

  if (metadataCache.has(url)) {
    return metadataCache.get(url) ?? null;
  }

  try {
    const result = await invoke<LinkMetadata>('fetch_link_metadata', { url });
    metadataCache.set(url, result);
    return result;
  } catch (err) {
    console.error('Failed to fetch link metadata:', err);
    metadataCache.set(url, null); // cache the failure too, so we don't retry the same broken URL every time
    return null;
  }
}

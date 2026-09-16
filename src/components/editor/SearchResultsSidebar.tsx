import { useEffect, useRef } from 'react';
import { CaseSensitive, ChevronDown, ChevronUp, Regex, X } from 'lucide-react';
import { useDocumentStore } from '@/lib/document/store';
import { useSidebarStore } from '@/lib/layout/sidebarStore';
import { useSearchStore } from '@/lib/editor/search/store';
import { useSearchMatches, useScrollToCurrentSearchMatch } from '@/lib/editor/search/useSearchMatches';
import { getGroupMismatchWarning } from '@/lib/editor/search/replaceWarning';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IconButton } from '@/components/layout/IconButton';
import { cn } from 'cn';

export function SearchResultsSidebar() {
  const editor = useDocumentStore((s) => s.editor);

  const isSidebarOpen = useSidebarStore((s) => s.active?.id === 'search');

  const searchTerm = useSearchStore((s) => s.searchTerm);
  const replaceTerm = useSearchStore((s) => s.replaceTerm);
  const caseSensitive = useSearchStore((s) => s.caseSensitive);
  const useRegex = useSearchStore((s) => s.useRegex);
  const focusToken = useSearchStore((s) => s.focusToken);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const setReplaceTerm = useSearchStore((s) => s.setReplaceTerm);
  const toggleCaseSensitive = useSearchStore((s) => s.toggleCaseSensitive);
  const toggleUseRegex = useSearchStore((s) => s.toggleUseRegex);
  const closeSearchState = useSearchStore((s) => s.close);

  const { matches, currentIndex, regexError, groupCount } = useSearchMatches(editor);
  useScrollToCurrentSearchMatch(currentIndex, matches.length);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const raf = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isSidebarOpen, focusToken]);

  useEffect(() => {
    if (!editor || !isSidebarOpen) return;
    const timeout = setTimeout(() => {
      editor.commands.setSearchQuery(searchTerm, { caseSensitive, useRegex });
    }, 150);
    return () => clearTimeout(timeout);
  }, [editor, isSidebarOpen, searchTerm, caseSensitive, useRegex]);

  if (!editor) return null;

  const hasMatches = matches.length > 0;
  const matchLabel = regexError ? null : hasMatches ? `${currentIndex + 1} of ${matches.length}` : searchTerm ? 'No results' : null;
  const groupWarning = getGroupMismatchWarning(useRegex, replaceTerm, groupCount);

  const handleNext = () => editor.commands.searchNext();
  const handlePrevious = () => editor.commands.searchPrevious();
  const handleReplace = () => editor.commands.replaceSearchMatch(replaceTerm);
  const handleReplaceAll = () => editor.commands.replaceAllSearchMatches(replaceTerm);
  const handleResultClick = (index: number) => {
    editor.commands.setSearchIndex(index);
    editor.commands.focus();
  };

  const handleClose = () => {
    useSidebarStore.getState().close();
    closeSearchState();
    editor.commands.clearSearch();
  };

  const handleKeyDown = (action: 'search' | 'replace') => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'search') {
        if (e.shiftKey) handlePrevious();
        else handleNext();
      } else {
        handleReplace();
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium">Document Search</span>
        <IconButton label="Close" icon={<X className="h-4 w-4" />} onClick={handleClose} />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-1 border-b border-border p-3">
        <Input
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown('search')}
          placeholder="Find in document"
          className="h-8"
        />
        <div className="flex items-center gap-1">
          <IconButton
            label="Match case"
            icon={<CaseSensitive className="h-4 w-4" />}
            active={caseSensitive}
            onClick={toggleCaseSensitive}
          />
          <IconButton
            label="Use regular expression"
            icon={<Regex className="h-4 w-4" />}
            active={useRegex}
            onClick={toggleUseRegex}
          />
        </div>

        <div className={cn('col-span-2 flex items-center justify-between text-xs text-muted-foreground min-h-4', regexError && 'text-destructive')}>
          <span>{regexError ? `Invalid regex: ${regexError}` : matchLabel}</span>
          <div className="flex items-center gap-1">
            <IconButton
              label="Previous match"
              icon={<ChevronUp className="h-3.5 w-3.5" />}
              onClick={handlePrevious}
              disabled={!hasMatches}
            />
            <IconButton
              label="Next match"
              icon={<ChevronDown className="h-3.5 w-3.5" />}
              onClick={handleNext}
              disabled={!hasMatches}
            />
          </div>
        </div>

        <Input
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          onKeyDown={handleKeyDown('replace')}
          placeholder="Replace with"
          className="h-8"
        />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8" onClick={handleReplace} disabled={!hasMatches}>
            Replace
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={handleReplaceAll} disabled={!hasMatches}>
            All
          </Button>
        </div>

        {groupWarning && <span className="col-span-2 text-xs text-amber-600">{groupWarning}</span>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            {searchTerm ? 'No matches found.' : 'Type a search term to see results here.'}
          </div>
        ) : (
          <ul>
            {matches.map((m, i) => (
              <li key={`${m.from}-${m.to}`}>
                <button
                  type="button"
                  onClick={() => handleResultClick(i)}
                  className={cn(
                    'w-full border-b border-border px-3 py-2 text-left text-sm leading-snug hover:bg-muted',
                    i === currentIndex && 'bg-muted',
                  )}
                >
                  <span className="text-muted-foreground">{m.contextBefore} </span>
                  <span className="tensor-search-match-current rounded px-0.5">{m.match}</span>
                  <span className="text-muted-foreground"> {m.contextAfter}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </TooltipProvider>
  );
}

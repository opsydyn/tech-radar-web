import React from 'react';
import type { CollectionEntry } from 'astro:content';
import { useAdrSearch } from '../hooks/useAdrSearch';
import * as styles from './AdrSearch.css';

interface AdrSearchProps {
  adrs: Array<CollectionEntry<'adr'>>;
  onSearchResults?: (filteredAdrs: Array<CollectionEntry<'adr'>>) => void;
}

const AdrSearch: React.FC<AdrSearchProps> = ({ adrs, onSearchResults }) => {
  const { 
    searchTerm, 
    filteredAdrs, 
    handleSearchChange, 
    clearSearch, 
    resultsCount, 
    hasSearchTerm 
  } = useAdrSearch(adrs);

  // Call the callback with filtered results whenever they change
  React.useEffect(() => {
    if (onSearchResults) {
      onSearchResults(filteredAdrs);
    }
  }, [filteredAdrs, onSearchResults]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search ADRs..."
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label="Search ADRs"
      />
      {hasSearchTerm && (
        <div className={styles.searchFooter}>
          <span className={styles.searchResultsCount}>
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </span>
          <button 
            className={styles.searchClearButton} 
            onClick={clearSearch}
            aria-label="Clear search"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default AdrSearch;

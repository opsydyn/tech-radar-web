import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { CollectionEntry } from 'astro:content';

// Options for Fuse.js search
const fuseOptions = {
  keys: ['data.title', 'data.tags', 'data.author', 'data.status', 'body'],
  threshold: 0.3,
  includeScore: true,
};

/**
 * Custom hook for searching ADRs using Fuse.js
 * @param adrs Array of ADRs to search through
 * @returns Search state and functions
 */
export const useAdrSearch = (adrs: Array<CollectionEntry<'adr'>>) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create a memoized instance of Fuse
  const fuse = useMemo(() => new Fuse(adrs, fuseOptions), [adrs]);
  
  // Get filtered results based on search term
  const filteredAdrs = useMemo(() => {
    if (!searchTerm.trim()) {
      return adrs;
    }
    
    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
  }, [fuse, searchTerm, adrs]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return {
    searchTerm,
    setSearchTerm,
    filteredAdrs,
    handleSearchChange,
    clearSearch,
    resultsCount: filteredAdrs.length,
    hasSearchTerm: searchTerm.trim().length > 0,
  };
};

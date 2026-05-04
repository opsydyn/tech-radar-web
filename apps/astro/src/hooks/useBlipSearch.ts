import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Blip } from '~types/radar-types';

// Options for Fuse.js search
const fuseOptions = {
  keys: ['name', 'description', 'ring', 'quadrant'],
  threshold: 0.3,
  includeScore: true,
};

/**
 * Custom hook for searching blips using Fuse.js
 * @param blips Array of blips to search through
 * @returns Search state and functions
 */
export const useBlipSearch = (blips: Array<Blip>) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create a memoized instance of Fuse
  const fuse = useMemo(() => new Fuse(blips, fuseOptions), [blips]);
  
  // Get filtered results based on search term
  const filteredBlips = useMemo(() => {
    if (!searchTerm.trim()) {
      return blips;
    }
    
    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
  }, [fuse, searchTerm, blips]);
  
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
    filteredBlips,
    handleSearchChange,
    clearSearch,
    resultsCount: filteredBlips.length,
    hasSearchTerm: searchTerm.trim().length > 0,
  };
};

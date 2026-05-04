import { useState, useRef, useEffect, useCallback } from 'react';
import * as styles from './StatusDropdown.css';
import * as toastStyles from './StatusToast.css';
import { setBlipColors, applyColorsToElement, setColorsFromQuadrant } from '../stores/blip-store';
import { getQuadrantColor, getQuadrantColorSolid, getQuadrantColorDark } from '../utils/quadrantColors';

interface StatusDropdownProps {
  blipId: string;
  currentRing: string;
  slug: string;
}

const StatusDropdown = ({ blipId, currentRing, slug }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const rings = ['Adopt', 'Trial', 'Assess', 'Hold'];
  
  // More idiomatic React with useCallback for event handlers
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);
  
  // Use effect for event listeners with proper cleanup
  useEffect(() => {
    // Add global event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);
  
  // Handle dropdown item selection with keyboard navigation
  const handleKeyboardNavigation = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      updateStatus(rings[index]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextElement = document.querySelector(`[data-index="${index + 1}"]`) as HTMLElement;
      if (nextElement) nextElement.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevElement = document.querySelector(`[data-index="${index - 1}"]`) as HTMLElement;
      if (prevElement) prevElement.focus();
    }
  }, [rings]);
  
  const updateStatus = useCallback(async (newRing: string) => {
    if (newRing === currentRing) {
      setIsOpen(false);
      return;
    }
    
    setIsUpdating(true);
    setError(null);
    
    try {
      setIsUpdating(true);
      
      // Use the original updateDb.api endpoint
      const response = await fetch('/api/blip/updateDb.api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blipId,
          updates: {
            ring: newRing,
            move: `${currentRing} → ${newRing}`
          },
          author: 'Web UI'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }
      
      // Get the container element
      const container = document.getElementById('blip-container');
      if (!container) {
        console.error('Blip container not found');
        throw new Error('Blip container not found');
      }
      
      // Get the current quadrant from the container
      const quadrant = container.getAttribute('data-quadrant') || 'tools';
      
      // Set colors based on quadrant and update the store
      console.log('Setting colors from quadrant:', quadrant);
      const colors = setColorsFromQuadrant(quadrant);
      
      // Apply colors directly to the container
      applyColorsToElement(container);
      
      // Update the ring heading to show the new status immediately
      const ringHeading = document.getElementById('ring-status');
      if (ringHeading) {
        ringHeading.textContent = newRing;
      }
      
      // Create a more reliable toast with direct styling
      const successMessage = document.createElement('div');
      successMessage.className = toastStyles.toast;
      successMessage.textContent = `Status updated to ${newRing}`;
      
      // Use the color from our store
      successMessage.style.backgroundColor = colors.quadrantColorSolid;
      document.body.appendChild(successMessage);
      
      // Auto-dismiss after 5 seconds with animation
      setTimeout(() => {
        successMessage.classList.add(toastStyles.fadeOutAnimation);
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 300); // Match animation duration
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating blip status:', err);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  }, [blipId, currentRing, slug]);
  
  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <button 
          className={isButtonHovered ? `${styles.button} ${styles.buttonHover}` : styles.button}
          onClick={toggleDropdown}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={isUpdating}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {isUpdating ? 'Updating...' : 'Change Status'}
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
            aria-hidden="true"
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div 
          className={isOpen ? `${styles.content} ${styles.contentVisible}` : styles.content}
          role="menu"
          aria-orientation="vertical"
        >
          {rings.map((ring, index) => {
            let itemClassName = styles.item;
            if (ring === currentRing) {
              itemClassName = `${styles.item} ${styles.itemActive}`;
            } else if (hoveredItem === index) {
              itemClassName = `${styles.item} ${styles.itemHover}`;
            }
            
            return (
              <div 
                key={ring}
                className={itemClassName}
                onClick={() => updateStatus(ring)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onKeyDown={(e) => handleKeyboardNavigation(e, index)}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                data-index={index}
              >
                {ring}
              </div>
            );
          })}
        </div>
      </div>
      {error && (
        <div 
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
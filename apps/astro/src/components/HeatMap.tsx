import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { HeatmapCircle } from '@visx/heatmap';
import type { CollectionEntry } from 'astro:content';
import { useState, useEffect, useRef } from 'react';
import type { z } from 'astro:content';
import { getEffectiveTheme } from '../stores/theme-store';

// Define tag type
export type TagType = 'Database' | 'Frontend' | 'Backend' | 'Mobile' | 'Cloud' | 'Qa';

// Define color schemes for different tags
const tagColorSchemes: Record<TagType | 'default', { base: string; bright: string }> = {
  Database: {
    base: '#2c5282', // Dark blue
    bright: '#4299e1', // Bright blue
  },
  Frontend: {
    base: '#744210', // Dark yellow
    bright: '#ecc94b', // Bright yellow
  },
  Backend: {
    base: '#276749', // Dark green
    bright: '#48bb78', // Bright green
  },
  Mobile: {
    base: '#702459', // Dark pink
    bright: '#ed64a6', // Bright pink
  },
  Cloud: {
    base: '#2a4365', // Dark indigo
    bright: '#667eea', // Bright indigo
  },
  Qa: {
    base: '#7b341e', // Dark orange
    bright: '#ed8936', // Bright orange
  },
  default: {
    base: '#77312f', // Original dark red
    bright: '#f33d15', // Original bright red
  }
};

// Default colors (used when no tag is specified)
const acceptedColor = tagColorSchemes.default.base;
const acceptedColorBright = tagColorSchemes.default.bright;

// Theme-based backgrounds
export const darkBackground = '#28272c';
export const lightBackground = '#f5f5f7';

// Define the structure for our heatmap bins
export type AdrBin = {
  bin: number;
  count: number;
};

export type AdrBins = {
  bins: AdrBin[];
};

// Convert ADR data to heatmap format, with optional tag filtering
function adrsToBins(adrs: CollectionEntry<'adr'>[], tag?: TagType): AdrBins[] {
  // Filter ADRs by tag if specified
  const filteredAdrs = tag 
    ? adrs.filter(adr => adr.data.tags && adr.data.tags.includes(tag))
    : adrs;

  // Group ADRs by month and year
  const groupedByDate = filteredAdrs.reduce((acc: Record<string, CollectionEntry<'adr'>[]>, adr) => {
    // Parse the date string to a Date object if it's not already
    const dateValue = adr.data.created;
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(adr);
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedByDate).sort();
  
  // Convert to bins format
  return sortedDates.map((date, i) => ({
    bins: groupedByDate[date].map((adr, j) => ({
      bin: j,
      count: adr.data.status === 'Accepted' ? 100 : 50, // Higher count for accepted ADRs
    })),
  }));
}

// Helper function to group ADRs by month-year for tooltip lookup
function getAdrsByMonthYear(adrs: CollectionEntry<'adr'>[], tag?: TagType): Record<string, CollectionEntry<'adr'>[]> {
  // Filter ADRs by tag if specified
  const filteredAdrs = tag 
    ? adrs.filter(adr => adr.data.tags && adr.data.tags.includes(tag))
    : adrs;

  return filteredAdrs.reduce((acc: Record<string, CollectionEntry<'adr'>[]>, adr) => {
    const dateValue = adr.data.created;
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(adr);
    return acc;
  }, {});
}

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.min(...data.map(value));
}

// accessors
const bins = (d: AdrBins) => d.bins;
const count = (d: AdrBin) => d.count;

export type HeatmapProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  adrs: CollectionEntry<'adr'>[];
  tag?: TagType; // Optional tag to filter and style by
  responsive?: boolean; // Whether to make the heatmap responsive to container size
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 110 };

function HeatMap({
  width: initialWidth,
  height: initialHeight,
  events = false,
  margin = defaultMargin,
  adrs,
  tag,
  responsive = true,
}: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  
  // Get current theme
  const effectiveTheme = getEffectiveTheme();
  const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';
  const background = isDarkTheme ? darkBackground : lightBackground;

  // Handle responsive sizing
  useEffect(() => {
    if (!responsive || !containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      setDimensions({
        width: containerWidth || initialWidth,
        height: containerHeight || initialHeight
      });
    };

    // Initial update
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [responsive, initialWidth, initialHeight]);

  // Convert ADRs to bin format, filtered by tag if specified
  const binData = adrsToBins(adrs, tag);
  
  // Skip rendering if no data
  if (binData.length === 0) {
    return <div>No ADR data available{tag ? ` for tag "${tag}"` : ''}</div>;
  }

  const colorMax = max(binData, (d) => max(bins(d), count));
  const bucketSizeMax = max(binData, (d) => bins(d).length);

  // Get color scheme based on tag
  const colorScheme = tag && tag in tagColorSchemes 
    ? tagColorSchemes[tag as keyof typeof tagColorSchemes] 
    : tagColorSchemes.default;
    
  // Adjust opacity based on theme
  const baseOpacity = isDarkTheme ? 0.1 : 0.2;

  // scales
  const xScale = scaleLinear<number>({
    domain: [0, binData.length],
  });
  const yScale = scaleLinear<number>({
    domain: [0, bucketSizeMax],
  });
  const circleColorScale = scaleLinear<string>({
    range: [colorScheme.base, colorScheme.bright],
    domain: [0, colorMax],
  });
  const opacityScale = scaleLinear<number>({
    range: [baseOpacity, 1],
    domain: [0, colorMax],
  });

  // bounds
  const xMax = dimensions.width - margin.left - margin.right;
  const yMax = dimensions.height - margin.bottom - margin.top;

  const binWidth = xMax / binData.length;
  const binHeight = yMax / bucketSizeMax;
  const radius = min([binWidth, binHeight], (d) => d) / 2;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  // State for hover effects
  const [hoveredCell, setHoveredCell] = useState<{row: number; column: number} | null>(null);
  const [tooltipData, setTooltipData] = useState<{x: number; y: number; content: string; href?: string} | null>(null);
  
  // Pre-compute ADRs by month-year for tooltip lookup
  const adrsByMonthYear = getAdrsByMonthYear(adrs, tag);
  const sortedMonthYears = Object.keys(adrsByMonthYear).sort();

  return (
    <div 
      ref={containerRef} 
      style={{ 
        ...containerStyle,
        position: 'relative', 
        height: '100%',
        minHeight: '150px'
      }}
    >
      {tag && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          padding: '4px 8px', 
          background: colorScheme.base, 
          color: 'white', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 5,
          boxShadow: isDarkTheme ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {tag}
        </div>
      )}
      <svg width={dimensions.width} height={dimensions.height}>
        <rect x={0} y={0} width={dimensions.width} height={dimensions.height} rx={14} fill={background} />
        {/* Add axis lines with theme-appropriate colors */}
        <Group top={margin.top} left={margin.left}>
          <line
            x1={0}
            y1={yMax}
            x2={xMax}
            y2={yMax}
            stroke={isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
            strokeWidth={1}
          />
        </Group>
        <Group top={margin.top} left={margin.left}>
          <HeatmapCircle
            data={binData}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            colorScale={circleColorScale}
            opacityScale={opacityScale}
            radius={radius}
            gap={2}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => {
                  const isHovered = hoveredCell?.row === bin.row && hoveredCell?.column === bin.column;
                  
                  // For click and tooltip handlers
                  const handleInteraction = (type: 'enter' | 'leave') => {
                    const monthIndex = bin.column;
                    const adrIndex = bin.row;
                    
                    if (type === 'leave') {
                      setHoveredCell(null);
                      setTooltipData(null);
                      return;
                    }
                    
                    if (monthIndex >= 0 && monthIndex < sortedMonthYears.length) {
                      const monthYearKey = sortedMonthYears[monthIndex];
                      const monthAdrs = adrsByMonthYear[monthYearKey];
                      
                      if (monthAdrs && adrIndex >= 0 && adrIndex < monthAdrs.length) {
                        const adr = monthAdrs[adrIndex];
                        
                        if (type === 'enter') {
                          setHoveredCell({ row: bin.row, column: bin.column });
                          const dateStr = new Date(adr.data.created).toLocaleDateString();
                          setTooltipData({
                            x: bin.cx + margin.left,
                            y: bin.cy + margin.top,
                            content: `${adr.data.title || adr.data.id} (${adr.data.status}) - ${dateStr}`,
                            href: `/adr/${adr.data.id}`
                          });
                        }
                      }
                    }
                  };

                  // Get the href for this circle
                  let href = '#';
                  const monthIndex = bin.column;
                  const adrIndex = bin.row;
                  
                  if (monthIndex >= 0 && monthIndex < sortedMonthYears.length) {
                    const monthYearKey = sortedMonthYears[monthIndex];
                    const monthAdrs = adrsByMonthYear[monthYearKey];
                    
                    if (monthAdrs && adrIndex >= 0 && adrIndex < monthAdrs.length) {
                      const adr = monthAdrs[adrIndex];
                      href = `/adr/${adr.data.id}`;
                    }
                  }
                  
                  return (
                    <a
                      key={`heatmap-link-${bin.row}-${bin.column}`}
                      href={href}
                      aria-label="View ADR details"
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        key={`heatmap-circle-${bin.row}-${bin.column}`}
                        className="visx-heatmap-circle"
                        cx={bin.cx}
                        cy={bin.cy}
                        r={isHovered ? bin.r * 1.1 : bin.r}
                        fill={bin.color}
                        fillOpacity={isHovered ? 1 : bin.opacity}
                        stroke={isHovered ? "#ffffff" : "none"}
                        strokeWidth={isHovered ? 2 : 0}
                        onMouseEnter={() => handleInteraction('enter')}
                        onMouseLeave={() => handleInteraction('leave')}
                        style={{ transition: 'all 0.2s ease-in-out' }}
                      />
                    </a>
                  );
                }),
              )
            }
          </HeatmapCircle>
        </Group>
      </svg>
      
      {/* Tooltip */}
      {tooltipData && (
        <a
          href={tooltipData.href}
          style={{
            position: 'absolute',
            top: tooltipData.y - 40,
            left: tooltipData.x,
            transform: 'translateX(-50%)',
            padding: '8px 12px',
            background: isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(50, 50, 50, 0.9)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px',
            pointerEvents: 'none',
            boxShadow: isDarkTheme ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {tooltipData.content}
        </a>
      )}
    </div>
  );
}

export default HeatMap;

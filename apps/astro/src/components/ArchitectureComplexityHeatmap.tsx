import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';
import { useMemo } from 'react';
import { getEffectiveTheme } from '~stores/theme-store';
import { vars } from '~styles/cyberpunk.css';
import type { ArchitectureLayer, ModuleComplexity } from '../utils/mockArchitectureData';
import { ARCHITECTURE_COLOR_SCHEMES } from '../utils/mockArchitectureData';
import { moduleHoverClass } from './ArchitectureComplexityHeatmap.css';

// Types following functional programming patterns
type HeatmapProps = {
    readonly data: readonly ModuleComplexity[];
    readonly width?: number;
    readonly height?: number;
};

// Constants
const MARGIN = { top: 40, right: 30, bottom: 50, left: 100 };
const LAYERS: readonly ArchitectureLayer[] = ['Presentation', 'Application', 'Domain', 'Infrastructure', 'Database', 'External'];

// Pure function to group modules by layer
const groupByLayer = (data: readonly ModuleComplexity[]): Record<ArchitectureLayer, readonly ModuleComplexity[]> => {
    const initial: Record<ArchitectureLayer, ModuleComplexity[]> = {
        Presentation: [],
        Application: [],
        Domain: [],
        Infrastructure: [],
        Database: [],
        External: []
    };

    return data.reduce((acc, module) => {
        acc[module.layer].push(module);
        return acc;
    }, initial);
};

// Pure function to calculate cell dimensions
const calculateCellDimensions = (
    width: number,
    height: number,
    layerCount: number,
    maxModulesInLayer: number
): { cellWidth: number; cellHeight: number } => ({
    cellWidth: (width - 100) / maxModulesInLayer,
    cellHeight: (height - 100) / layerCount
});

// Pure function to get color based on complexity score
const getComplexityColor = (score: number, isDark: boolean): string => {
    if (score > 75) return isDark ? '#ef4444' : '#dc2626';
    if (score > 50) return isDark ? '#f97316' : '#ea580c';
    if (score > 25) return isDark ? '#eab308' : '#ca8a04';
    return isDark ? '#22c55e' : '#16a34a';
};

export const ArchitectureComplexityHeatmap = ({
    data,
    height = 300,
    width = 800
}: HeatmapProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

    // Memoized data transformations
    const groupedData = useMemo(() => groupByLayer(data), [data]);
    const maxModules = useMemo(
        () => Math.max(...Object.values(groupedData).map(modules => modules.length)),
        [groupedData]
    );
    const { cellWidth, cellHeight } = useMemo(
        () => calculateCellDimensions(width, height, Object.keys(groupedData).length, maxModules),
        [width, height, groupedData, maxModules]
    );

    // Theme-based styling
    const styles = {
        container: {
            width: '100%',
            height: '100%',
            fontFamily: vars.fonts.mono,
            color: isDarkTheme ? '#ffffff' : '#000000'
        },
        layerRow: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
        },
        layerLabel: {
            width: '120px',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'right' as const,
            paddingRight: '12px'
        },
        moduleCell: {
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
            margin: '2px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out'
        },
        tooltip: {
            position: 'absolute' as const,
            backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDarkTheme ? vars.colors.darkBgAlt : '#e2e8f0'}`,
            borderRadius: '4px',
            padding: '8px',
            fontSize: '12px',
            zIndex: 1000,
            pointerEvents: 'none' as const,
            boxShadow: isDarkTheme
                ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(57, 255, 20, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
    } as const;

    return (
        <div style={styles.container}>
            {(Object.entries(groupedData) as [ArchitectureLayer, readonly ModuleComplexity[]][]).map(([layer, modules]) => (
                <div key={layer} style={styles.layerRow}>
                    <div style={styles.layerLabel}>{layer}</div>
                    <div style={{ display: 'flex' }}>
                        {modules.map((module) => (
                            <div
                                key={module.module}
                                className={moduleHoverClass}
                                style={{
                                    ...styles.moduleCell,
                                    backgroundColor: getComplexityColor(module.complexity_score, isDarkTheme)
                                }}
                                title={`
                  Module: ${module.module}
                  Complexity: ${module.complexity_score}
                  LOC: ${module.lines_of_code}
                  Dependencies: ${module.dependencies_count}
                  Violations: ${module.violation_count}
                `}
                            >
                                <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
                                    {module.complexity_score}
                                </div>
                                <div style={{ color: '#ffffff', opacity: 0.8, fontSize: '9px' }}>
                                    {module.module.split('/').pop()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArchitectureComplexityHeatmap;
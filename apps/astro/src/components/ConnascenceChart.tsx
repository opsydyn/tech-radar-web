// Connascence Chart Component - Horizontal Bar Chart
// Following functional programming patterns from CLAUDE.md with visx

import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import { withTooltip } from '@visx/tooltip';
import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { Either } from 'effect';
import React, { useMemo, useCallback, useState } from 'react';

import * as styles from './ConnascenceChart.css';
import type { ConnascenceData, ConnascenceEntry, SeverityCategory } from './connascence.types';
import { SEVERITY_COLORS } from './connascence.types';
import {
    CONNASCENCE_CHART_CONFIG,
    createChartScales,
    formatConnascenceTypeName,
    generateConnascenceData,
    generateTooltipContent,
    getCategoryStats
} from './connascence.utils';

// 🎯 Component props with proper typing
type ConnascenceChartBaseProps = {
    width?: number;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showStats?: boolean;
    interactive?: boolean;
    onBarClick?: (entry: ConnascenceEntry) => void;
    onBarHover?: (entry: ConnascenceEntry | null) => void;
};

type ConnascenceChartProps = ConnascenceChartBaseProps & WithTooltipProvidedProps<ConnascenceEntry>;

// 🎨 Pure component for individual bar rendering
const ConnascenceBar = React.memo(({
    entry,
    x,
    y,
    width,
    height,
    isHovered,
    isSelected,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onKeyDown
}: {
    entry: ConnascenceEntry;
    x: number;
    y: number;
    width: number;
    height: number;
    isHovered: boolean;
    isSelected: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}) => {
    const barState = isSelected ? 'selected' : isHovered ? 'hovered' : 'idle';

    return (
        <Group>
            <Bar
                x={x}
                y={y}
                width={width}
                height={height}
                className={styles.barRect({ state: barState, severity: entry.category })}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onKeyDown={onKeyDown}
                tabIndex={0}
                role="button"
                aria-label={`${entry.type}: severity ${entry.severity}`}
            />

            {/* Bar label (connascence type) */}
            <Text
                x={x - 10}
                y={y + height / 2}
                className={styles.barLabel}
                textAnchor="end"
                verticalAnchor="middle"
            >
                {formatConnascenceTypeName(entry.type)}
            </Text>

            {/* Bar value (severity score) */}
            <Text
                x={x + width + 5}
                y={y + height / 2}
                className={styles.barValue}
                textAnchor="start"
                verticalAnchor="middle"
            >
                {entry.severity}
            </Text>
        </Group>
    );
});

ConnascenceBar.displayName = 'ConnascenceBar';

// 🎨 Pure component for chart legend
const ChartLegend = React.memo(({ data }: { data: ConnascenceData }) => {
    const categories: SeverityCategory[] = ['low', 'medium', 'high'];

    return (
        <div className={styles.legend}>
            {categories.map(category => (
                <div key={category} className={styles.legendItem}>
                    <div
                        className={styles.legendColor}
                        style={{ backgroundColor: SEVERITY_COLORS[category] }}
                    />
                    <span>{category} ({data.entries.filter(e => e.category === category).length})</span>
                </div>
            ))}
        </div>
    );
});

ChartLegend.displayName = 'ChartLegend';

// 🎨 Pure component for statistics panel
const StatsPanel = React.memo(({ data }: { data: ConnascenceData }) => {
    const stats = getCategoryStats(data);

    return (
        <div className={styles.statsPanel}>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{data.entries.length}</div>
                <div className={styles.statLabel}>Total Types</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.high.count}</div>
                <div className={styles.statLabel}>High Severity</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.medium.count}</div>
                <div className={styles.statLabel}>Medium Severity</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.low.count}</div>
                <div className={styles.statLabel}>Low Severity</div>
            </div>
        </div>
    );
});

StatsPanel.displayName = 'StatsPanel';

// 🎯 Main Connascence Chart component
const ConnascenceChartComponent = ({
    width = 600,
    height = 400,
    showGrid = true,
    showLegend = true,
    showStats = true,
    interactive = true,
    onBarClick,
    onBarHover,
    showTooltip,
    hideTooltip
}: ConnascenceChartProps) => {
    // 🎰 Local state for interactions
    const [hoveredEntry, setHoveredEntry] = useState<ConnascenceEntry | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<ConnascenceEntry | null>(null);

    // 📊 Generate chart data using pure functions
    const chartData = useMemo(() => {
        const dataResult = generateConnascenceData();
        return Either.isRight(dataResult) ? dataResult.right : null;
    }, []);

    // 📏 Create scales and dimensions
    const { xScale, yScale, colorScale } = useMemo(() => {
        if (!chartData) return { xScale: null, yScale: null, colorScale: null };

        const scalesResult = createChartScales(chartData, width, height);
        if (Either.isLeft(scalesResult)) {
            return { xScale: null, yScale: null, colorScale: null };
        }

        return scalesResult.right;
    }, [chartData, width, height]);

    // 🎯 Event handlers using functional patterns
    const handleBarHover = useCallback((entry: ConnascenceEntry, event: React.MouseEvent) => {
        if (!interactive) return;

        setHoveredEntry(entry);
        onBarHover?.(entry);

        if (showTooltip) {
            showTooltip({
                tooltipData: entry,
                tooltipLeft: event.clientX,
                tooltipTop: event.clientY,
            });
        }
    }, [interactive, onBarHover, showTooltip]);

    const handleBarLeave = useCallback(() => {
        if (!interactive) return;

        setHoveredEntry(null);
        onBarHover?.(null);
        hideTooltip?.();
    }, [interactive, onBarHover, hideTooltip]);

    const handleBarClick = useCallback((entry: ConnascenceEntry) => {
        if (!interactive) return;

        setSelectedEntry(entry === selectedEntry ? null : entry);
        onBarClick?.(entry);
    }, [interactive, selectedEntry, onBarClick]);

    const handleKeyDown = useCallback((entry: ConnascenceEntry) => (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBarClick(entry);
        }
    }, [handleBarClick]);

    // 🚨 Error handling - return null if data generation failed
    if (!chartData || !xScale || !yScale || !colorScale) {
        return (
            <div className={styles.container}>
                <div className={styles.title}>Connascence Levels</div>
                <div className={styles.subtitle}>
                    Error: Unable to generate chart data. Please check configuration.
                </div>
            </div>
        );
    }

    // 📏 Calculate chart dimensions
    const margin = CONNASCENCE_CHART_CONFIG.PADDING;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create visx scales
    const xScaleVisx = scaleLinear({
        domain: [0, Number(chartData.maxSeverity)],
        range: [0, innerWidth],
    });

    const yScaleVisx = scaleBand({
        domain: chartData.entries.map(d => d.type),
        range: [0, innerHeight],
        padding: 0.2,
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Connascence Levels</h2>
            <p className={styles.subtitle}>
                Severity ranking of coupling types in software systems
            </p>

            {/* Statistics Panel */}
            {showStats && <StatsPanel data={chartData} />}

            {/* Chart Legend */}
            {showLegend && <ChartLegend data={chartData} />}

            {/* Main Chart */}
            <div className={styles.svgContainer}>
                <svg
                    width={width}
                    height={height}
                    className={styles.svg}
                    role="img"
                    aria-labelledby="connascence-chart-title"
                >
                    <title id="connascence-chart-title">
                        Connascence levels chart showing severity rankings from low to high
                    </title>

                    <Group left={margin.left} top={margin.top}>
                        {/* Grid lines */}
                        {showGrid && (
                            <GridColumns
                                scale={xScaleVisx}
                                width={innerWidth}
                                height={innerHeight}
                                className={styles.gridLine}
                            />
                        )}

                        {/* Bars */}
                        {chartData.entries.map((entry, index) => {
                            const barWidth = xScaleVisx(Number(entry.severity));
                            const barHeight = yScaleVisx.bandwidth();
                            const barY = yScaleVisx(entry.type) || 0;

                            return (
                                <ConnascenceBar
                                    key={entry.type}
                                    entry={entry}
                                    x={0}
                                    y={barY}
                                    width={barWidth}
                                    height={barHeight}
                                    isHovered={hoveredEntry === entry}
                                    isSelected={selectedEntry === entry}
                                    onMouseEnter={() => handleBarHover(entry, {} as React.MouseEvent)}
                                    onMouseLeave={handleBarLeave}
                                    onClick={() => handleBarClick(entry)}
                                    onKeyDown={handleKeyDown(entry)}
                                />
                            );
                        })}

                        {/* Axes */}
                        <AxisBottom
                            scale={xScaleVisx}
                            top={innerHeight}
                            label="Severity Level"
                            labelClassName={styles.axisLabel}
                            tickClassName={styles.axisLabel}
                        />

                        <AxisLeft
                            scale={yScaleVisx}
                            tickFormat={() => ''} // We render labels manually
                            tickClassName={styles.axisLabel}
                        />
                    </Group>
                </svg>
            </div>

            {/* Selected entry details */}
            {selectedEntry && (
                <div className={styles.tooltip} style={{ position: 'relative', marginTop: '1rem' }}>
                    <div className={styles.tooltipTitle}>
                        {selectedEntry.type}
                    </div>
                    <div className={styles.tooltipContent}>
                        <p>{selectedEntry.description}</p>
                        <p><strong>Severity:</strong> {selectedEntry.severity}/10 ({selectedEntry.category})</p>
                        {selectedEntry.examples.length > 0 && (
                            <p><strong>Examples:</strong> {selectedEntry.examples.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎯 Export with tooltip HOC
export const ConnascenceChartWithTooltip = withTooltip<ConnascenceChartProps, ConnascenceEntry>(
    ConnascenceChartComponent
);

// 🎯 Export standalone component for direct usage
export const ConnascenceChart = (props: ConnascenceChartBaseProps) => (
    <ConnascenceChartComponent
        {...props}
        showTooltip={() => { }}
        hideTooltip={() => { }}
        tooltipData={undefined}
        tooltipLeft={0}
        tooltipTop={0}
        tooltipOpen={false}
        updateTooltip={() => { }}
    />
);

// 🎪 Export component props type for external usage
export type { ConnascenceChartBaseProps, ConnascenceChartProps };

// 🎯 Default export
export default ConnascenceChart;
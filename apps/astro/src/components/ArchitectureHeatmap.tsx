import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';
import { useMemo } from 'react';
import { getEffectiveTheme } from '~stores/theme-store';
import type { ArchitectureLayer, ComplexityMetric } from '../utils/mockArchitectureData';
import { ARCHITECTURE_COLOR_SCHEMES } from '../utils/mockArchitectureData';
import * as styles from './ArchitectureHeatmap.css';

// Types following functional programming patterns
type HeatmapProps = {
    readonly data: readonly ComplexityMetric[];
    readonly height?: number;
    readonly width?: number;
};

type LayerData = {
    readonly layer: ArchitectureLayer;
    readonly bins: readonly number[];
};

type HeatmapData = {
    readonly x: number;
    readonly y: number;
    readonly value: number;
};

// Constants
const MARGIN = { top: 40, right: 30, bottom: 50, left: 100 };
const LAYERS: readonly ArchitectureLayer[] = ['Presentation', 'Application', 'Domain', 'Infrastructure', 'Database', 'External'];
const METRICS = ['complexity_score', 'cyclomatic_complexity', 'dependency_count', 'loc'] as const;
const BIN_COUNT = 10;

// Pure function to bin data into ranges
const binData = (data: readonly ComplexityMetric[]): readonly LayerData[] => {
    const layerMap = new Map<ArchitectureLayer, number[]>();

    // Initialize bins for each layer
    for (const layer of LAYERS) {
        layerMap.set(layer, Array(BIN_COUNT).fill(0));
    }

    // Calculate max values for normalization
    const maxValues = {
        complexity_score: Math.max(...data.map(d => d.complexity_score)),
        cyclomatic_complexity: Math.max(...data.map(d => d.cyclomatic_complexity)),
        dependency_count: Math.max(...data.map(d => d.dependency_count)),
        loc: Math.max(...data.map(d => d.loc))
    };

    // Bin the data
    for (const item of data) {
        const normalizedValue = (
            item.complexity_score / maxValues.complexity_score +
            item.cyclomatic_complexity / maxValues.cyclomatic_complexity +
            item.dependency_count / maxValues.dependency_count +
            item.loc / maxValues.loc
        ) / 4;

        const binIndex = Math.min(Math.floor(normalizedValue * BIN_COUNT), BIN_COUNT - 1);
        const bins = layerMap.get(item.layer);
        if (bins) {
            bins[binIndex]++;
        }
    }

    return Array.from(layerMap.entries()).map(([layer, bins]) => ({
        layer,
        bins
    }));
};

// Pure function to transform data for heatmap
const transformToHeatmapData = (layerData: readonly LayerData[]): readonly HeatmapData[] => {
    const result: HeatmapData[] = [];

    for (let i = 0; i < layerData.length; i++) {
        const { bins } = layerData[i];
        for (let j = 0; j < bins.length; j++) {
            result.push({
                x: j,
                y: i,
                value: bins[j]
            });
        }
    }

    return result;
};

export const ArchitectureHeatmap = ({
    data,
    width = 800,
    height = 400
}: HeatmapProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

    // Calculate dimensions
    const xMax = width - MARGIN.left - MARGIN.right;
    const yMax = height - MARGIN.top - MARGIN.bottom;
    const binWidth = xMax / BIN_COUNT;
    const binHeight = yMax / LAYERS.length;

    // Memoized data transformations
    const layerData = useMemo(() => binData(data), [data]);
    const heatmapData = useMemo(() => transformToHeatmapData(layerData), [layerData]);

    // Scales
    const xScale = scaleLinear({
        domain: [0, BIN_COUNT],
        range: [0, xMax]
    });

    const yScale = scaleLinear({
        domain: [0, LAYERS.length],
        range: [0, yMax]
    });

    const colorScale = scaleLinear({
        domain: [0, Math.max(...heatmapData.map(d => d.value))],
        range: isDarkTheme ? ['#1F2937', '#059669'] : ['#E5E7EB', '#047857']
    });

    return (
        <div className={styles.container}>
            <svg width={width} height={height}>
                <Group top={MARGIN.top} left={MARGIN.left}>
                    <HeatmapRect
                        data={heatmapData}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        binWidth={binWidth}
                        binHeight={binHeight}
                        gap={2}
                    >
                        {heatmap => (
                            <Group>
                                {heatmap.map(bins => (
                                    <Group key={`heatmap-bins-${bins.row}`}>
                                        {bins.map(bin => (
                                            <rect
                                                key={`heatmap-bin-${bin.row}-${bin.column}`}
                                                x={bin.x}
                                                y={bin.y}
                                                width={bin.width}
                                                height={bin.height}
                                                fill={bin.color}
                                                rx={2}
                                            />
                                        ))}
                                    </Group>
                                ))}
                            </Group>
                        )}
                    </HeatmapRect>

                    {/* Y-axis labels */}
                    {LAYERS.map((layer, i) => (
                        <text
                            key={layer}
                            x={-10}
                            y={yScale(i) + binHeight / 2}
                            dy=".32em"
                            textAnchor="end"
                            fill={isDarkTheme ? '#E5E7EB' : '#374151'}
                            fontSize={12}
                        >
                            {layer}
                        </text>
                    ))}

                    {/* X-axis labels */}
                    <text
                        x={xMax / 2}
                        y={yMax + 40}
                        textAnchor="middle"
                        fill={isDarkTheme ? '#E5E7EB' : '#374151'}
                        fontSize={12}
                    >
                        Complexity Score (normalized)
                    </text>

                    {/* Title */}
                    <text
                        x={xMax / 2}
                        y={-20}
                        textAnchor="middle"
                        fill={isDarkTheme ? '#E5E7EB' : '#374151'}
                        fontSize={14}
                        fontWeight="bold"
                    >
                        Module Complexity Distribution by Layer
                    </text>
                </Group>
            </svg>

            {/* Legend */}
            <div className={styles.legend}>
                <strong>Metrics included:</strong>
                <div className={styles.metricsContainer}>
                    {METRICS.map(metric => (
                        <div key={metric}>
                            • {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArchitectureHeatmap;

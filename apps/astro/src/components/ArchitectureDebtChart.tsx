import { useMemo } from 'react';
import { getEffectiveTheme } from '~stores/theme-store';
import { vars } from '~styles/cyberpunk.css';
import type {
    ArchitectureDebtType,
    CouplingMetric,
    LayerViolation,
    ModuleComplexity,
    WeeklyArchData
} from '../utils/mockArchitectureData';
import {
    ARCHITECTURE_COLOR_SCHEMES,
    VIOLATION_SEVERITY_COLORS,
    mockArchitectureDebtService
} from '../utils/mockArchitectureData';
import ArchitectureComplexityHeatmap from './ArchitectureComplexityHeatmap';
import ArchitectureTrendsChart from './ArchitectureTrendsChart';

// Types following functional programming patterns
type ArchitectureDebtChartProps = {
    readonly chartType: 'trends' | 'complexity' | 'coupling' | 'violations';
    readonly height?: number;
    readonly width?: number;
};

// Pure function to determine chart title
const getChartTitle = (chartType: ArchitectureDebtChartProps['chartType']): string => {
    const titles: Record<typeof chartType, string> = {
        trends: 'Architecture Violation Trends',
        complexity: 'Module Complexity Heatmap',
        coupling: 'Module Coupling Network',
        violations: 'Layer Violation Analysis'
    } as const;
    return titles[chartType];
};

// Pure function to get chart data based on type
const getChartData = (chartType: ArchitectureDebtChartProps['chartType']) => {
    const dataFetchers: Record<typeof chartType, () => unknown> = {
        trends: () => mockArchitectureDebtService.getViolationTrends(8),
        complexity: () => mockArchitectureDebtService.getModuleComplexityMatrix(),
        coupling: () => mockArchitectureDebtService.getCouplingNetwork(),
        violations: () => mockArchitectureDebtService.getLayerViolations()
    } as const;
    return dataFetchers[chartType]();
};

// Pure function to get chart dimensions
const getChartDimensions = (
    baseHeight: number,
    baseWidth: number,
    chartType: ArchitectureDebtChartProps['chartType']
): { height: number; width: number } => {
    const dimensions: Record<typeof chartType, { height: number; width: number }> = {
        trends: { height: baseHeight - 40, width: baseWidth - 40 },
        complexity: { height: baseHeight - 40, width: baseWidth - 40 },
        coupling: { height: baseHeight - 40, width: baseWidth - 40 },
        violations: { height: baseHeight - 40, width: baseWidth - 40 }
    } as const;
    return dimensions[chartType];
};

export const ArchitectureDebtChart = ({
    chartType,
    height = 400,
    width = 800
}: ArchitectureDebtChartProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

    // Memoized data fetching using pure functions
    const chartData = useMemo(() => getChartData(chartType), [chartType]);
    const title = useMemo(() => getChartTitle(chartType), [chartType]);
    const dimensions = useMemo(
        () => getChartDimensions(height, width, chartType),
        [height, width, chartType]
    );

    // Theme-based styling using lookup
    const chartStyles = {
        container: {
            width: '100%',
            maxWidth: width,
            margin: '0 auto',
            fontFamily: vars.fonts.mono,
            color: isDarkTheme ? '#ffffff' : '#000000'
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center' as const
        },
        chartArea: {
            height,
            backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            border: `1px solid ${isDarkTheme ? vars.colors.darkBgAlt : '#e2e8f0'}`
        }
    } as const;

    return (
        <div style={chartStyles.container}>
            <h3 style={chartStyles.title}>{title}</h3>
            <div style={chartStyles.chartArea}>
                {chartType === 'trends' && (
                    <ArchitectureTrendsChart
                        data={chartData as readonly WeeklyArchData[]}
                        {...dimensions}
                    />
                )}
                {chartType === 'complexity' && (
                    <ArchitectureComplexityHeatmap
                        data={chartData as readonly ModuleComplexity[]}
                        {...dimensions}
                    />
                )}
                {chartType === 'coupling' && (
                    <div>
                        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: dimensions.height }}>
                            {JSON.stringify(chartData, null, 2)}
                        </pre>
                    </div>
                )}
                {chartType === 'violations' && (
                    <div>
                        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: dimensions.height }}>
                            {JSON.stringify(chartData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchitectureDebtChart;
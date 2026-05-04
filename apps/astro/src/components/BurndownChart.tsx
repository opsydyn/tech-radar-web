import {
    AnimatedAxis,
    AnimatedLineSeries,
    Tooltip,
    XYChart,
    buildChartTheme,
} from '@visx/xychart';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { getEffectiveTheme } from '~stores/theme-store';
import { vars } from '~styles/cyberpunk.css';
import type { WeeklyData } from '../utils/mockDependabotData';
import TechDebtLegend from './TechDebtLegend';

// Types following functional programming patterns
type ChartDataPoint = {
    readonly x: Date;
    readonly y: number;
};

type TooltipData = {
    nearestDatum?: {
        datum: ChartDataPoint;
    };
    datumByKey?: {
        actual?: { datum: ChartDataPoint };
        target?: { datum: ChartDataPoint };
    };
};

type BurndownChartProps = {
    readonly actualData: readonly WeeklyData[];
    readonly targetData: readonly WeeklyData[];
    readonly height?: number;
    readonly width?: number;
};

// Lookup tables for theme-based styling
const THEME_COLORS = {
    actual: vars.colors.neonPink,
    target: vars.colors.neonBlue,
} as const;

const THEME_CONFIG = {
    fontFamily: vars.fonts.mono,
    fontSize: { small: 11, medium: 13, large: 15 }
} as const;

// Enhanced styling lookup tables for better readability
const AXIS_STYLING = {
    margin: {
        left: 60,
        bottom: 40,
        top: 20,
        right: 20
    },
    label: {
        offset: 45,
        textAnchor: 'middle' as const,
        dominantBaseline: 'middle' as const
    }
} as const;

const CHART_COLORS = {
    dark: {
        axis: vars.colors.darkBgAlt,
        tickStroke: '#4a5568',
        tickText: '#a0aec0',
        labelText: '#ffffff',
        gridLines: 'rgba(74, 85, 104, 0.3)'
    },
    light: {
        axis: '#e2e8f0',
        tickStroke: '#718096',
        tickText: '#4a5568',
        labelText: '#000000',
        gridLines: 'rgba(226, 232, 240, 0.8)'
    }
} as const;

// Pure function transformations
const transformToChartData = (weeklyData: readonly WeeklyData[]): ChartDataPoint[] =>
    weeklyData.map(([week, count]) => ({
        x: parseISO(week),
        y: count
    }));

const chartAccessors = {
    xAccessor: (d: ChartDataPoint) => d.x,
    yAccessor: (d: ChartDataPoint) => d.y,
} as const;

const calculateMaxY = (data: readonly WeeklyData[]): number =>
    Math.max(...data.map(([, count]) => count)) + 2;

export const BurndownChart = ({
    actualData,
    targetData,
    height = 300,
    width = 800
}: BurndownChartProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

    // Memoized pure transformations
    const transformedActualData = useMemo(
        () => transformToChartData(actualData),
        [actualData]
    );

    const transformedTargetData = useMemo(
        () => transformToChartData(targetData),
        [targetData]
    );

    const themeColors = useMemo(() =>
        isDarkTheme ? CHART_COLORS.dark : CHART_COLORS.light,
        [isDarkTheme]
    );

    const customTheme = useMemo(() => buildChartTheme({
        backgroundColor: 'transparent',
        colors: [THEME_COLORS.actual, THEME_COLORS.target],
        gridColor: themeColors.gridLines,
        gridColorDark: themeColors.gridLines,
        svgLabelSmall: { fill: themeColors.tickText },
        svgLabelBig: { fill: themeColors.labelText },
        tickLength: 6
    }), [themeColors]);

    const maxY = useMemo(() => calculateMaxY(actualData), [actualData]);

    return (
        <div style={{ width: '100%' }}>
            <div style={{ height }}>
                <XYChart
                    height={height}
                    width={width}
                    xScale={{ type: 'time' }}
                    yScale={{ type: 'linear', domain: [0, maxY] }}
                    theme={customTheme}
                    margin={AXIS_STYLING.margin}
                >
                    <AnimatedAxis
                        orientation="bottom"
                        stroke={themeColors.axis}
                        tickStroke={themeColors.tickStroke}
                        tickLabelProps={{
                            fill: themeColors.tickText,
                            fontSize: THEME_CONFIG.fontSize.small,
                            fontFamily: THEME_CONFIG.fontFamily,
                            textAnchor: 'middle'
                        }}
                    />
                    <AnimatedAxis
                        orientation="left"
                        stroke={themeColors.axis}
                        tickStroke={themeColors.tickStroke}
                        tickLabelProps={{
                            fill: themeColors.tickText,
                            fontSize: THEME_CONFIG.fontSize.small,
                            fontFamily: THEME_CONFIG.fontFamily,
                            textAnchor: 'end'
                        }}
                        label="PRs Merged"
                        labelProps={{
                            fill: themeColors.labelText,
                            fontSize: THEME_CONFIG.fontSize.large,
                            fontFamily: THEME_CONFIG.fontFamily,
                            fontWeight: 'bold',
                            textAnchor: AXIS_STYLING.label.textAnchor,
                            dominantBaseline: AXIS_STYLING.label.dominantBaseline
                        }}
                        labelOffset={AXIS_STYLING.label.offset}
                    />

                    <AnimatedLineSeries
                        dataKey="actual"
                        data={transformedActualData}
                        stroke={THEME_COLORS.actual}
                        strokeWidth={3}
                        {...chartAccessors}
                    />

                    <AnimatedLineSeries
                        dataKey="target"
                        data={transformedTargetData}
                        stroke={THEME_COLORS.target}
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        {...chartAccessors}
                    />

                    <Tooltip
                        snapTooltipToDatumX
                        showVerticalCrosshair
                        renderTooltip={({ tooltipData }) => {
                            const data = tooltipData as TooltipData;
                            const x = data?.nearestDatum?.datum?.x;
                            const actual = data?.datumByKey?.actual?.datum?.y;
                            const target = data?.datumByKey?.target?.datum?.y;

                            return (
                                <div style={{
                                    background: isDarkTheme ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                                    border: `2px solid ${themeColors.axis}`,
                                    borderRadius: '6px',
                                    padding: '10px 14px',
                                    color: themeColors.tickText,
                                    fontSize: `${THEME_CONFIG.fontSize.medium}px`,
                                    fontFamily: THEME_CONFIG.fontFamily,
                                    boxShadow: isDarkTheme
                                        ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(57, 255, 20, 0.2)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    minWidth: '120px'
                                }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: themeColors.labelText,
                                        marginBottom: '6px',
                                        fontSize: `${THEME_CONFIG.fontSize.medium}px`
                                    }}>
                                        {x?.toLocaleDateString()}
                                    </div>
                                    <div style={{
                                        color: THEME_COLORS.actual,
                                        marginBottom: '2px',
                                        fontWeight: '600'
                                    }}>
                                        Actual: {actual}
                                    </div>
                                    <div style={{
                                        color: THEME_COLORS.target,
                                        fontWeight: '600'
                                    }}>
                                        Target: {target}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </XYChart>
            </div>
            <TechDebtLegend type="burndown" compact={true} />
        </div>
    );
};

export default BurndownChart;
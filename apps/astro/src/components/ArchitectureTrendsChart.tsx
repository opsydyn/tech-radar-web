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
import type { WeeklyArchData } from '../utils/mockArchitectureData';

// Types following functional programming patterns
type ChartDataPoint = {
    readonly x: Date;
    readonly y: number;
};

type TrendsChartProps = {
    readonly data: readonly WeeklyArchData[];
    readonly height?: number;
    readonly width?: number;
};

// Pure function transformations
const transformToChartData = (weeklyData: readonly WeeklyArchData[]): ChartDataPoint[] =>
    weeklyData.map(([week, count]) => ({
        x: parseISO(week),
        y: count
    }));

// Lookup tables for theme-based styling
const THEME_CONFIG = {
    fontFamily: vars.fonts.mono,
    fontSize: { small: 11, medium: 13, large: 15 }
} as const;

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
        gridLines: 'rgba(74, 85, 104, 0.3)',
        line: vars.colors.neonPink
    },
    light: {
        axis: '#e2e8f0',
        tickStroke: '#718096',
        tickText: '#4a5568',
        labelText: '#000000',
        gridLines: 'rgba(226, 232, 240, 0.8)',
        line: vars.colors.neonPink
    }
} as const;

// Pure function to calculate max Y value
const calculateMaxY = (data: readonly WeeklyArchData[]): number =>
    Math.max(...data.map(([, count]) => count)) + 2;

export const ArchitectureTrendsChart = ({
    data,
    height = 300,
    width = 800
}: TrendsChartProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

    // Memoized pure transformations
    const transformedData = useMemo(
        () => transformToChartData(data),
        [data]
    );

    const themeColors = useMemo(() =>
        isDarkTheme ? CHART_COLORS.dark : CHART_COLORS.light,
        [isDarkTheme]
    );

    const customTheme = useMemo(() => buildChartTheme({
        backgroundColor: 'transparent',
        colors: [themeColors.line],
        gridColor: themeColors.gridLines,
        gridColorDark: themeColors.gridLines,
        svgLabelSmall: { fill: themeColors.tickText },
        svgLabelBig: { fill: themeColors.labelText },
        tickLength: 6
    }), [themeColors]);

    const maxY = useMemo(() => calculateMaxY(data), [data]);

    // Accessors for chart data
    const accessors = {
        xAccessor: (d: ChartDataPoint) => d.x,
        yAccessor: (d: ChartDataPoint) => d.y
    } as const;

    return (
        <div style={{ width: '100%', height }}>
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
                    label="Time"
                    labelProps={{
                        fill: themeColors.labelText,
                        fontSize: THEME_CONFIG.fontSize.large,
                        fontFamily: THEME_CONFIG.fontFamily,
                        textAnchor: AXIS_STYLING.label.textAnchor
                    }}
                    labelOffset={AXIS_STYLING.label.offset}
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
                    label="Violations"
                    labelProps={{
                        fill: themeColors.labelText,
                        fontSize: THEME_CONFIG.fontSize.large,
                        fontFamily: THEME_CONFIG.fontFamily,
                        textAnchor: AXIS_STYLING.label.textAnchor,
                        dominantBaseline: AXIS_STYLING.label.dominantBaseline
                    }}
                    labelOffset={AXIS_STYLING.label.offset}
                />

                <AnimatedLineSeries
                    dataKey="violations"
                    data={transformedData}
                    {...accessors}
                    stroke={themeColors.line}
                    strokeWidth={3}
                />

                <Tooltip
                    snapTooltipToDatumX
                    showVerticalCrosshair
                    renderTooltip={({ tooltipData }) => {
                        if (!tooltipData?.nearestDatum) return null;

                        const datum = tooltipData.nearestDatum.datum as ChartDataPoint;
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
                                    marginBottom: '6px'
                                }}>
                                    {datum.x.toLocaleDateString()}
                                </div>
                                <div style={{
                                    color: themeColors.line,
                                    fontWeight: '600'
                                }}>
                                    Violations: {datum.y}
                                </div>
                            </div>
                        );
                    }}
                />
            </XYChart>
        </div>
    );
};

export default ArchitectureTrendsChart;
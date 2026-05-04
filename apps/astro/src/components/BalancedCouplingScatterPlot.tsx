import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import type React from "react";

export type ModulePair = {
    label: string;
    strength: number;
    distance: number;
    volatility: number;
};

export type BalancedCouplingScatterPlotProps = {
    data: ModulePair[];
    width?: number;
    height?: number;
};

const defaultWidth = 480;
const defaultHeight = 380;
const margin = { top: 50, right: 50, bottom: 80, left: 80 };

const colorScale = (volatility: number) => {
    // Green (low) to yellow (mid) to red (high)
    if (volatility <= 3) return '#b5e853';
    if (volatility <= 7) return '#ffe066';
    return '#ff5e5b';
};

const BalancedCouplingScatterPlot: React.FC<BalancedCouplingScatterPlotProps> = ({ data, width = defaultWidth, height = defaultHeight }) => {
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleLinear({ domain: [1, 10], range: [0, xMax] });
    const yScale = scaleLinear({ domain: [1, 10], range: [yMax, 0] });

    return (
        <svg width={width} height={height} aria-label="Module Coupling Scatter Plot">
            <title>Module Coupling Scatter Plot</title>
            <Group left={margin.left} top={margin.top}>
                {/* X-axis label */}
                <text
                    x={xMax / 2}
                    y={yMax + 50}
                    textAnchor="middle"
                    fill="#b5e853"
                    fontSize={16}
                    fontWeight="bold"
                >
                    Integration Strength
                </text>
                <text
                    x={xMax / 2}
                    y={yMax + 70}
                    textAnchor="middle"
                    fill="#b5e853"
                    fontSize={12}
                >
                    (1: API only, 10: Deep entanglement)
                </text>

                {/* Y-axis label */}
                <text
                    x={-yMax / 2}
                    y={-60}
                    textAnchor="middle"
                    fill="#b5e853"
                    fontSize={16}
                    fontWeight="bold"
                    transform="rotate(-90)"
                >
                    Architectural Distance
                </text>
                <text
                    x={-yMax / 2}
                    y={-40}
                    textAnchor="middle"
                    fill="#b5e853"
                    fontSize={12}
                    transform="rotate(-90)"
                >
                    (1: Same object, 10: Different vendors)
                </text>

                {/* Axes */}
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    numTicks={10}
                    tickLabelProps={() => ({ fill: '#b5e853', fontSize: 14, dy: '0.5em' })}
                    stroke="#b5e853"
                    tickStroke="#b5e853"
                    hideAxisLine={false}
                />
                <AxisLeft
                    scale={yScale}
                    numTicks={10}
                    tickLabelProps={() => ({ fill: '#b5e853', fontSize: 14, dx: '-0.5em' })}
                    stroke="#b5e853"
                    tickStroke="#b5e853"
                    hideAxisLine={false}
                />

                {/* Legend for volatility */}
                <Group top={-35} left={xMax - 240}>
                    <text fill="#b5e853" fontSize={11} fontWeight="bold">Volatility:</text>
                    <circle cx={90} cy={0} r={8} fill="#b5e853" />
                    <text x={105} y={4} fill="#b5e853" fontSize={12}>Low </text>
                    <circle cx={160} cy={0} r={8} fill="#ffe066" />
                    <text x={175} y={4} fill="#b5e853" fontSize={12}>Medium</text>
                    <circle cx={240} cy={0} r={8} fill="#ff5e5b" />
                    <text x={255} y={4} fill="#b5e853" fontSize={12}>High</text>
                </Group>

                {/* Points */}
                {data.map((d, i) => (
                    <g key={d.label}>
                        <circle
                            cx={xScale(d.strength)}
                            cy={yScale(d.distance)}
                            r={12}
                            fill={colorScale(d.volatility)}
                            stroke="#222"
                            strokeWidth={2}
                        />
                        <title>{`${d.label}\nStrength: ${d.strength}\nDistance: ${d.distance}\nVolatility: ${d.volatility}`}</title>
                        <text
                            x={xScale(d.strength)}
                            y={yScale(d.distance) - 18}
                            textAnchor="middle"
                            fontSize={13}
                            fill="#b5e853"
                        >
                            {d.label}
                        </text>
                    </g>
                ))}
            </Group>
        </svg>
    );
};

export default BalancedCouplingScatterPlot;
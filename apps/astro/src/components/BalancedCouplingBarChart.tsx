import { AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import type React from "react";
import { calculateBalance, calculateModularity } from './BalancedCouplingExplorer.machine';

export type BalancedCouplingBarChartProps = {
    strength: number;
    distance: number;
    volatility: number;
};

const chartWidth = 480;
const chartHeight = 280;
const barWidth = 90;
const barGap = 60;
const maxScore = 10;

const yScale = scaleLinear({
    domain: [0, maxScore],
    range: [maxScore * 12, 0],
});

const BalancedCouplingBarChart: React.FC<BalancedCouplingBarChartProps> = ({ strength, distance, volatility }) => {
    const modularity = calculateModularity(strength, distance);
    const balance = calculateBalance(modularity, volatility);

    const data = [
        { label: 'Modularity', value: modularity },
        { label: 'Balance', value: balance },
    ];

    return (
        <svg width={chartWidth} height={chartHeight} aria-label="Balanced Coupling Bar Chart">
            <title>Balanced Coupling Bar Chart</title>
            <Group left={60} top={20}>
                {data.map((d, i) => (
                    <Bar
                        key={d.label}
                        x={i * (barWidth + barGap)}
                        y={yScale(d.value)}
                        width={barWidth}
                        height={yScale(0) - yScale(d.value)}
                        fill={d.label === 'Balance' ? '#b5e853' : '#5e81ac'}
                        rx={6}
                    />
                ))}
                {/* Value labels */}
                {data.map((d, i) => (
                    <text
                        key={`${d.label}-label`}
                        x={i * (barWidth + barGap) + barWidth / 2}
                        y={yScale(d.value) - 8}
                        textAnchor="middle"
                        fontSize={20}
                        fill="#b5e853"
                        fontWeight={600}
                    >
                        {d.value}
                    </text>
                ))}
                {/* X axis labels */}
                {data.map((d, i) => (
                    <text
                        key={`${d.label}-x`}
                        x={i * (barWidth + barGap) + barWidth / 2}
                        y={yScale(0) + 25}
                        textAnchor="middle"
                        fontSize={16}
                        fill="#b5e853"
                    >
                        {d.label}
                    </text>
                ))}
                {/* Y axis */}
                <AxisLeft
                    scale={yScale}
                    left={-10}
                    numTicks={6}
                    tickLabelProps={() => ({ fill: '#b5e853', fontSize: 14, textAnchor: 'end', dx: -4 })}
                    stroke="#b5e853"
                    tickStroke="#b5e853"
                />
            </Group>
        </svg>
    );
};

export default BalancedCouplingBarChart;
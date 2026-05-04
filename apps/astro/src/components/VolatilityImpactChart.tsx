import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Circle, LinePath } from "@visx/shape";
import type React from "react";
import {
	calculateBalance,
	calculateModularity,
} from "./BalancedCouplingExplorer.machine";

export type VolatilityImpactChartProps = {
	strength: number;
	distance: number;
	width?: number;
	height?: number;
};

const defaultWidth = 340;
const defaultHeight = 180;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

const VolatilityImpactChart: React.FC<VolatilityImpactChartProps> = ({
	strength,
	distance,
	width = defaultWidth,
	height = defaultHeight,
}) => {
	const modularity = calculateModularity(strength, distance);
	const data = Array.from({ length: 10 }, (_, i) => {
		const volatility = i + 1;
		return {
			volatility,
			balance: calculateBalance(modularity, volatility),
		};
	});

	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;

	const xScale = scaleLinear({ domain: [1, 10], range: [0, xMax] });
	const yScale = scaleLinear({ domain: [1, 10], range: [yMax, 0] });

	return (
		<svg width={width} height={height} aria-label="Volatility Impact Chart">
			<title>Volatility Impact Chart</title>
			<Group left={margin.left} top={margin.top}>
				<AxisBottom
					top={yMax}
					scale={xScale}
					numTicks={10}
					label="Volatility"
					tickLabelProps={() => ({
						fill: "#b5e853",
						fontSize: 12,
						dy: "0.5em",
					})}
					stroke="#b5e853"
					tickStroke="#b5e853"
					labelProps={{ fill: "#b5e853", fontSize: 14, dy: "2.5em" }}
				/>
				<AxisLeft
					scale={yScale}
					numTicks={10}
					label="Balance"
					tickLabelProps={() => ({
						fill: "#b5e853",
						fontSize: 12,
						dx: "-0.5em",
					})}
					stroke="#b5e853"
					tickStroke="#b5e853"
					labelProps={{ fill: "#b5e853", fontSize: 14, dx: "-2.5em" }}
				/>
				<LinePath
					data={data}
					x={(d) => xScale(d.volatility)}
					y={(d) => yScale(d.balance)}
					stroke="#b5e853"
					strokeWidth={3}
				/>
				{data.map((d, i) => (
					<Circle
						key={d.volatility}
						cx={xScale(d.volatility)}
						cy={yScale(d.balance)}
						r={5}
						fill="#b5e853"
						stroke="#222"
						strokeWidth={2}
					/>
				))}
			</Group>
		</svg>
	);
};

export default VolatilityImpactChart;

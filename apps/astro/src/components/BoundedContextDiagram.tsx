import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import type React from "react";
import { useState } from "react";
import * as styles from "./BoundedContextDiagram.css";

// Updated bounded contexts for car marketplace
const boundedContexts = [
	{
		id: "lead",
		name: "Lead Management",
		type: "core",
		x: 100,
		y: 100,
		width: 200,
		height: 100,
	},
	{
		id: "listings",
		name: "Car Listings",
		type: "supporting",
		x: 420,
		y: 100,
		width: 200,
		height: 100,
	},
	{
		id: "dealer",
		name: "Dealer Centre Tools",
		type: "core",
		x: 100,
		y: 300,
		width: 200,
		height: 100,
	},
	{
		id: "payment",
		name: "Payment & Finance",
		type: "supporting",
		x: 420,
		y: 300,
		width: 200,
		height: 100,
	},
	{
		id: "auth",
		name: "Authentication",
		type: "generic",
		x: 260,
		y: 450,
		width: 200,
		height: 100,
	},
	{
		id: "valuation",
		name: "External Valuation",
		type: "generic",
		x: 650,
		y: 220,
		width: 180,
		height: 100,
	},
];

// Updated relationships for car marketplace
const relationships = [
	{ source: "lead", target: "dealer", type: "downstream" },
	{ source: "listings", target: "lead", type: "upstream" },
	{ source: "lead", target: "payment", type: "partnership" },
	{ source: "auth", target: "lead", type: "anti-corruption layer" },
	{ source: "auth", target: "dealer", type: "anti-corruption layer" },
	{ source: "auth", target: "listings", type: "anti-corruption layer" },
	{ source: "auth", target: "payment", type: "anti-corruption layer" },
	{ source: "listings", target: "valuation", type: "upstream" },
];

const contextColors = {
	core: "#ff5e5b", // Red
	supporting: "#5e81ac", // Blue
	generic: "#b5e853", // Green
};

const relationshipStyles = {
	upstream: { stroke: "#b5e853", strokeWidth: 2, strokeDasharray: "0" },
	downstream: { stroke: "#5e81ac", strokeWidth: 2, strokeDasharray: "5,5" },
	partnership: { stroke: "#ffe066", strokeWidth: 3, strokeDasharray: "0" },
	"anti-corruption layer": {
		stroke: "#ff5e5b",
		strokeWidth: 2,
		strokeDasharray: "10,5",
	},
};

const BoundedContextDiagram: React.FC<{ width?: number; height?: number }> = ({
	width = 900,
	height = 600,
}) => {
	const [hoveredContext, setHoveredContext] = useState<string | null>(null);
	const [hoveredRelationship, setHoveredRelationship] = useState<string | null>(
		null,
	);

	const getContext = (id: string) => boundedContexts.find((c) => c.id === id);
	const getRelationshipId = (source: string, target: string) =>
		`${source}-${target}`;
	const isRelationshipHighlighted = (source: string, target: string) => {
		const relationshipId = getRelationshipId(source, target);
		return (
			relationshipId === hoveredRelationship ||
			source === hoveredContext ||
			target === hoveredContext
		);
	};
	const getRelationshipPath = (source, target) => {
		const sourceX = source.x + source.width / 2;
		const sourceY = source.y + source.height / 2;
		const targetX = target.x + target.width / 2;
		const targetY = target.y + target.height / 2;
		return [
			{ x: sourceX, y: sourceY },
			{ x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 },
			{ x: targetX, y: targetY },
		];
	};
	return (
		<div className={styles.container}>
			<div className={styles.legend}>
				<div className={styles.legendSection}>
					<div className={styles.legendTitle}>Bounded Context Types:</div>
					{Object.entries(contextColors).map(([type, color]) => (
						<div key={type} className={styles.legendItem}>
							<div
								className={styles.legendColor}
								style={{ backgroundColor: color }}
							></div>
							<div className={styles.legendText}>{type}</div>
						</div>
					))}
				</div>
				<div className={styles.legendSection}>
					<div className={styles.legendTitle}>Relationship Types:</div>
					{Object.entries(relationshipStyles).map(([type, style]) => (
						<div key={type} className={styles.legendItem}>
							<div
								className={styles.legendLine}
								style={{
									backgroundColor: style.stroke,
									height: style.strokeWidth,
									borderTop:
										style.strokeDasharray !== "0"
											? `2px ${style.stroke} dashed`
											: "none",
								}}
							></div>
							<div className={styles.legendText}>{type}</div>
						</div>
					))}
				</div>
			</div>
			<svg width={width} height={height} className={styles.diagram}>
				<Group>
					{/* Draw relationships */}
					{relationships.map(({ source, target, type }) => {
						const sourceContext = getContext(source);
						const targetContext = getContext(target);
						const relationshipId = getRelationshipId(source, target);
						if (!sourceContext || !targetContext) return null;
						const highlighted = isRelationshipHighlighted(source, target);
						const { stroke, strokeWidth, strokeDasharray } =
							relationshipStyles[type];
						const path = getRelationshipPath(sourceContext, targetContext);
						return (
							<g
								key={relationshipId}
								onMouseEnter={() => setHoveredRelationship(relationshipId)}
								onMouseLeave={() => setHoveredRelationship(null)}
							>
								<LinePath
									data={path}
									x={(d) => d.x}
									y={(d) => d.y}
									stroke={stroke}
									strokeWidth={highlighted ? strokeWidth + 1 : strokeWidth}
									strokeDasharray={strokeDasharray}
									markerEnd="url(#arrow)"
									opacity={highlighted ? 1 : 0.7}
								/>
								<Text
									x={(path[0].x + path[2].x) / 2}
									y={(path[0].y + path[2].y) / 2 - 10}
									textAnchor="middle"
									fill={stroke}
									fontSize={12}
									fontWeight={highlighted ? "bold" : "normal"}
								>
									{type === "anti-corruption layer"
										? "Anti-Corruption Layer"
										: type}
								</Text>
							</g>
						);
					})}
					{/* Draw bounded contexts */}
					{boundedContexts.map((context) => {
						const isHighlighted = context.id === hoveredContext;
						return (
							<g
								key={context.id}
								onMouseEnter={() => setHoveredContext(context.id)}
								onMouseLeave={() => setHoveredContext(null)}
							>
								<rect
									x={context.x}
									y={context.y}
									width={context.width}
									height={context.height}
									rx={8}
									fill={contextColors[context.type]}
									stroke="#222"
									strokeWidth={isHighlighted ? 3 : 1}
									opacity={isHighlighted ? 1 : 0.8}
								/>
								<Text
									x={context.x + context.width / 2}
									y={context.y + context.height / 2}
									textAnchor="middle"
									verticalAnchor="middle"
									fill="#222"
									fontWeight="bold"
								>
									{context.name}
								</Text>
								<Text
									x={context.x + context.width / 2}
									y={context.y + context.height - 15}
									textAnchor="middle"
									fill="#222"
									fontSize={12}
								>
									{context.type}
								</Text>
							</g>
						);
					})}
					{/* Arrow marker definition */}
					<defs>
						<marker
							id="arrow"
							viewBox="0 0 10 10"
							refX="5"
							refY="5"
							markerWidth="6"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 0 L 10 5 L 0 10 z" fill="#b5e853" />
						</marker>
					</defs>
				</Group>
			</svg>
		</div>
	);
};

export default BoundedContextDiagram;

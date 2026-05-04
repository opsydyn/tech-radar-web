// Pure transformation functions for Wardley mapping visualization
// Following functional programming patterns from CLAUDE.md

import { Either } from "effect";
import {
	COMPONENT_TYPES,
	type ComponentId,
	type ComponentLayout,
	type ComponentPosition,
	type DependencyPath,
	EVOLUTION_STAGES,
	type EvolutionPosition,
	type EvolutionStage,
	type Result,
	VISIBILITY_LEVELS,
	type ValuePosition,
	WARDLEY_CONFIG,
	type WardleyComponent,
	type WardleyError,
	type WardleyLayout,
	type WardleyMap,
} from "./wardley.types";

// 🎯 Configuration constants for layout calculations
const LAYOUT_CONFIG = {
	PADDING: WARDLEY_CONFIG.PADDING,
	AXIS_LABEL_HEIGHT: WARDLEY_CONFIG.AXIS_LABEL_HEIGHT,
	COMPONENT_MIN_RADIUS: WARDLEY_CONFIG.COMPONENT_MIN_RADIUS,
	COMPONENT_MAX_RADIUS: WARDLEY_CONFIG.COMPONENT_MAX_RADIUS,
	DEPENDENCY_STROKE_WIDTH: WARDLEY_CONFIG.DEPENDENCY_STROKE_WIDTH,
	EVOLUTION_STAGES: WARDLEY_CONFIG.EVOLUTION_STAGES,
	VALUE_LEVELS: WARDLEY_CONFIG.VALUE_LEVELS,
} as const;

// 📐 Pure functions for coordinate transformations
export const transformEvolutionToX = (
	evolution: EvolutionPosition,
	width: number,
): number => {
	const chartWidth = width - 2 * LAYOUT_CONFIG.PADDING;
	return LAYOUT_CONFIG.PADDING + evolution * chartWidth;
};

export const transformValueToY = (
	value: ValuePosition,
	height: number,
): number => {
	const chartHeight =
		height - 2 * LAYOUT_CONFIG.PADDING - LAYOUT_CONFIG.AXIS_LABEL_HEIGHT;
	// Invert Y axis so high value is at top
	return LAYOUT_CONFIG.PADDING + (1 - value) * chartHeight;
};

export const transformXToEvolution = (
	x: number,
	width: number,
): EvolutionPosition => {
	const chartWidth = width - 2 * LAYOUT_CONFIG.PADDING;
	const evolution = Math.max(
		0,
		Math.min(1, (x - LAYOUT_CONFIG.PADDING) / chartWidth),
	);
	return evolution as EvolutionPosition;
};

export const transformYToValue = (y: number, height: number): ValuePosition => {
	const chartHeight =
		height - 2 * LAYOUT_CONFIG.PADDING - LAYOUT_CONFIG.AXIS_LABEL_HEIGHT;
	const value = Math.max(
		0,
		Math.min(1, 1 - (y - LAYOUT_CONFIG.PADDING) / chartHeight),
	);
	return value as ValuePosition;
};

// 🎨 Pure function for component radius calculation
export const calculateComponentRadius = (
	component: WardleyComponent,
): number => {
	const typeInfo = COMPONENT_TYPES[component.type];
	const baseRadius = (component.size / 10) * LAYOUT_CONFIG.COMPONENT_MAX_RADIUS;
	const minRadius = LAYOUT_CONFIG.COMPONENT_MIN_RADIUS;

	return Math.max(
		minRadius,
		Math.min(LAYOUT_CONFIG.COMPONENT_MAX_RADIUS, baseRadius),
	);
};

// 🏗️ Pure function for component layout generation
export const transformComponentToLayout = (
	component: WardleyComponent,
	width: number,
	height: number,
): Result<ComponentLayout, WardleyError> => {
	try {
		const screenX = transformEvolutionToX(component.evolution, width);
		const screenY = transformValueToY(component.value, height);
		const radius = calculateComponentRadius(component);

		const layout: ComponentLayout = {
			...component,
			position: { x: component.evolution, y: component.value },
			screenX,
			screenY,
			radius,
		};

		return Either.right(layout);
	} catch (error) {
		return Either.left({
			type: "CalculationError",
			operation: "transformComponentToLayout",
			message: `Failed to transform component ${component.id}: ${error}`,
		});
	}
};

// 🔗 Pure function for dependency path calculation
export const calculateDependencyPath = (
	fromComponent: ComponentLayout,
	toComponent: ComponentLayout,
): Result<string, WardleyError> => {
	try {
		const fromX = fromComponent.screenX;
		const fromY = fromComponent.screenY;
		const toX = toComponent.screenX;
		const toY = toComponent.screenY;

		// Calculate connection points on component circles
		const dx = toX - fromX;
		const dy = toY - fromY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance === 0) {
			return Either.left({
				type: "CalculationError",
				operation: "calculateDependencyPath",
				message: "Components are at the same position",
			});
		}

		const unitX = dx / distance;
		const unitY = dy / distance;

		// Start and end points on circle edges
		const startX = fromX + unitX * fromComponent.radius;
		const startY = fromY + unitY * fromComponent.radius;
		const endX = toX - unitX * toComponent.radius;
		const endY = toY - unitY * toComponent.radius;

		// Create curved path for better visual appeal
		const midX = (startX + endX) / 2;
		const midY = (startY + endY) / 2;
		const controlOffset = Math.min(50, distance * 0.2);

		// Perpendicular offset for curve
		const perpX = -unitY * controlOffset;
		const perpY = unitX * controlOffset;

		const controlX = midX + perpX;
		const controlY = midY + perpY;

		const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

		return Either.right(path);
	} catch (error) {
		return Either.left({
			type: "CalculationError",
			operation: "calculateDependencyPath",
			message: `Failed to calculate dependency path: ${error}`,
		});
	}
};

// 🗺️ Pure function for complete layout generation
export const generateWardleyLayout = (
	map: WardleyMap,
): Result<WardleyLayout, WardleyError> => {
	const { width, height } = map;

	// Validate dimensions
	if (width < WARDLEY_CONFIG.MIN_WIDTH || height < WARDLEY_CONFIG.MIN_HEIGHT) {
		return Either.left({
			type: "ValidationError",
			field: "dimensions",
			message: `Layout dimensions must be at least ${WARDLEY_CONFIG.MIN_WIDTH}x${WARDLEY_CONFIG.MIN_HEIGHT}`,
		});
	}

	// Transform components to layout
	const componentLayouts: ComponentLayout[] = [];
	for (const component of map.components) {
		const layoutResult = transformComponentToLayout(component, width, height);
		if (Either.isLeft(layoutResult)) {
			return Either.left(layoutResult.left);
		}
		componentLayouts.push(layoutResult.right);
	}

	// Generate dependency paths
	const dependencyPaths: DependencyPath[] = [];
	for (const dependency of map.dependencies) {
		const fromComponent = componentLayouts.find(
			(c) => c.id === dependency.from,
		);
		const toComponent = componentLayouts.find((c) => c.id === dependency.to);

		if (!fromComponent || !toComponent) {
			return Either.left({
				type: "DependencyError",
				componentId: dependency.from,
				message: `Cannot find components for dependency: ${dependency.from} -> ${dependency.to}`,
			});
		}

		const pathResult = calculateDependencyPath(fromComponent, toComponent);
		if (Either.isLeft(pathResult)) {
			return Either.left(pathResult.left);
		}

		const dependencyPath: DependencyPath = {
			dependency,
			path: pathResult.right,
			startX: fromComponent.screenX,
			startY: fromComponent.screenY,
			endX: toComponent.screenX,
			endY: toComponent.screenY,
		};

		dependencyPaths.push(dependencyPath);
	}

	// Generate evolution axis
	const evolutionAxis = Object.entries(EVOLUTION_STAGES).map(
		([stage, info]) => ({
			stage: stage as EvolutionStage,
			position: transformEvolutionToX(
				info.position as EvolutionPosition,
				width,
			),
			label: info.label,
		}),
	);

	// Generate value axis
	const valueAxis = Array.from(
		{ length: LAYOUT_CONFIG.VALUE_LEVELS },
		(_, i) => {
			const value = i / (LAYOUT_CONFIG.VALUE_LEVELS - 1);
			return {
				level:
					value === 1
						? "User Visible"
						: value === 0
							? "Infrastructure"
							: `Level ${i}`,
				position: transformValueToY(value as ValuePosition, height),
			};
		},
	);

	const layout: WardleyLayout = {
		map,
		components: componentLayouts,
		dependencies: dependencyPaths,
		evolutionAxis,
		valueAxis,
	};

	return Either.right(layout);
};

// 🎯 Pure functions for interaction calculations
export const findComponentAtPosition = (
	x: number,
	y: number,
	layout: WardleyLayout,
): ComponentId | null => {
	// Find component under mouse position
	for (const component of layout.components) {
		const dx = x - component.screenX;
		const dy = y - component.screenY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance <= component.radius) {
			return component.id;
		}
	}

	return null;
};

export const getComponentDependencies = (
	componentId: ComponentId,
	layout: WardleyLayout,
): { incoming: ComponentLayout[]; outgoing: ComponentLayout[] } => {
	const incoming: ComponentLayout[] = [];
	const outgoing: ComponentLayout[] = [];

	for (const dependency of layout.dependencies) {
		if (dependency.dependency.to === componentId) {
			const fromComponent = layout.components.find(
				(c) => c.id === dependency.dependency.from,
			);
			if (fromComponent) {
				incoming.push(fromComponent);
			}
		}
		if (dependency.dependency.from === componentId) {
			const toComponent = layout.components.find(
				(c) => c.id === dependency.dependency.to,
			);
			if (toComponent) {
				outgoing.push(toComponent);
			}
		}
	}

	return { incoming, outgoing };
};

// 📊 Pure functions for analysis and insights
export const analyzeEvolutionStage = (
	component: WardleyComponent,
): {
	stage: EvolutionStage;
	description: string;
	nextStage?: EvolutionStage;
	risk: "low" | "medium" | "high";
} => {
	const stageInfo = EVOLUTION_STAGES[component.stage];
	const evolutionValue = component.evolution;

	// Determine next evolution stage
	const stages: EvolutionStage[] = [
		"Genesis",
		"Custom",
		"Product",
		"Commodity",
	];
	const currentIndex = stages.indexOf(component.stage);
	const nextStage =
		currentIndex < stages.length - 1 ? stages[currentIndex + 1] : undefined;

	// Calculate risk based on position vs stage
	let risk: "low" | "medium" | "high" = "low";
	const expectedPosition = stageInfo.position;
	const positionDiff = Math.abs(evolutionValue - expectedPosition);

	if (positionDiff > 0.2) {
		risk = "high";
	} else if (positionDiff > 0.1) {
		risk = "medium";
	}

	return {
		stage: component.stage,
		description: stageInfo.description,
		nextStage,
		risk,
	};
};

export const calculateStrategicValue = (
	component: WardleyComponent,
): {
	userValue: number;
	strategicImportance: number;
	evolutionPressure: number;
	overallScore: number;
} => {
	const userValue = component.value; // Higher value = more user visible
	const strategicImportance = component.size / 10; // Normalized size

	// Evolution pressure: components further right face more commoditization pressure
	const evolutionPressure = component.evolution;

	// Overall strategic score (weighted combination)
	const overallScore =
		userValue * 0.4 + strategicImportance * 0.4 + (1 - evolutionPressure) * 0.2;

	return {
		userValue,
		strategicImportance,
		evolutionPressure,
		overallScore,
	};
};

// 🎨 Pure functions for visual styling
export const getComponentColor = (component: WardleyComponent): string => {
	return COMPONENT_TYPES[component.type].color;
};

export const getVisibilityColor = (component: WardleyComponent): string => {
	return VISIBILITY_LEVELS[component.visibility].color;
};

export const getComponentOpacity = (
	component: WardleyComponent,
	isSelected: boolean,
	isHovered: boolean,
	isFiltered: boolean,
): number => {
	if (isFiltered) return 0.3;
	if (isSelected) return 1.0;
	if (isHovered) return 0.8;
	return 0.6;
};

// 🔍 Pure functions for filtering and search
export const filterComponentsByVisibility = (
	components: readonly ComponentLayout[],
	visibilityFilter: string | null,
): ComponentLayout[] => {
	if (!visibilityFilter) return [...components];
	return components.filter((c) => c.visibility === visibilityFilter);
};

export const filterComponentsByEvolutionStage = (
	components: readonly ComponentLayout[],
	stageFilter: EvolutionStage | null,
): ComponentLayout[] => {
	if (!stageFilter) return [...components];
	return components.filter((c) => c.stage === stageFilter);
};

export const searchComponents = (
	components: readonly ComponentLayout[],
	searchTerm: string,
): ComponentLayout[] => {
	if (!searchTerm.trim()) return [...components];

	const term = searchTerm.toLowerCase();
	return components.filter(
		(c) =>
			c.name.toLowerCase().includes(term) ||
			c.type.toLowerCase().includes(term) ||
			c.stage.toLowerCase().includes(term) ||
			c.visibility.toLowerCase().includes(term),
	);
};

// 🧮 Utility functions for component integration
export const createDefaultMap = (): WardleyMap => {
	return {
		title: "Sample Wardley Map",
		components: [],
		dependencies: [],
		anchor: "user-need" as ComponentId,
		width: WARDLEY_CONFIG.DEFAULT_WIDTH,
		height: WARDLEY_CONFIG.DEFAULT_HEIGHT,
	};
};

export const validateMapDimensions = (
	width: number,
	height: number,
): Result<{ width: number; height: number }, WardleyError> => {
	if (width < WARDLEY_CONFIG.MIN_WIDTH || height < WARDLEY_CONFIG.MIN_HEIGHT) {
		return Either.left({
			type: "ValidationError",
			field: "dimensions",
			message: `Map dimensions must be at least ${WARDLEY_CONFIG.MIN_WIDTH}x${WARDLEY_CONFIG.MIN_HEIGHT}`,
		});
	}

	return Either.right({ width, height });
};

// 🎪 Export configuration for component usage
export const WARDLEY_UTILS_CONFIG = {
	DEFAULT_CURVE_OFFSET: 50,
	MIN_DEPENDENCY_DISTANCE: 20,
	SELECTION_TOLERANCE: 5,
	DRAG_THRESHOLD: 10,
	ANIMATION_DURATION: 300,
} as const;

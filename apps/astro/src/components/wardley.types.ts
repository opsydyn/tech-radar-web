// Domain types for Wardley mapping visualization
// Following functional programming patterns from CLAUDE.md

import { Either, Match } from "effect";

// 🏷️ Branded types for type safety
export type ComponentId = string & { readonly _brand: "ComponentId" };
export type ComponentName = string & { readonly _brand: "ComponentName" };
export type EvolutionPosition = number & {
	readonly _brand: "EvolutionPosition";
}; // 0-1
export type ValuePosition = number & { readonly _brand: "ValuePosition" }; // 0-1
export type DependencyStrength = number & {
	readonly _brand: "DependencyStrength";
}; // 0-1

// 🎯 Core domain enums
export type EvolutionStage = "Genesis" | "Custom" | "Product" | "Commodity";
export type VisibilityLevel = "Visible" | "Internal" | "Infrastructure";
export type MovementDirection = "Evolving" | "Stable" | "Declining";
export type ComponentType =
	| "User"
	| "Business"
	| "Data"
	| "Infrastructure"
	| "Anchor";

// 🎯 Interaction state types (avoiding boolean blindness)
export type InteractionState =
	| { type: "idle" }
	| { type: "hovering"; componentId: ComponentId }
	| { type: "selected"; componentId: ComponentId }
	| {
			type: "dragging";
			componentId: ComponentId;
			startX: number;
			startY: number;
	  };

// 🏗️ Core domain entities
export type WardleyComponent = {
	readonly id: ComponentId;
	readonly name: ComponentName;
	readonly evolution: EvolutionPosition;
	readonly value: ValuePosition;
	readonly stage: EvolutionStage;
	readonly visibility: VisibilityLevel;
	readonly type: ComponentType;
	readonly movement?: MovementDirection;
	readonly size: number; // Relative importance 1-10
	readonly dependencies: readonly ComponentId[];
};

export type ComponentDependency = {
	readonly from: ComponentId;
	readonly to: ComponentId;
	readonly strength: DependencyStrength;
	readonly type: "ValueFlow" | "DataFlow" | "Control";
};

export type WardleyMap = {
	readonly title: string;
	readonly components: readonly WardleyComponent[];
	readonly dependencies: readonly ComponentDependency[];
	readonly anchor: ComponentId; // User/customer need
	readonly width: number;
	readonly height: number;
};

// 🎯 Layout and positioning types
export type ComponentPosition = {
	readonly x: number;
	readonly y: number;
};

export type ComponentLayout = WardleyComponent & {
	readonly position: ComponentPosition;
	readonly screenX: number;
	readonly screenY: number;
	readonly radius: number;
};

export type DependencyPath = {
	readonly dependency: ComponentDependency;
	readonly path: string; // SVG path data
	readonly startX: number;
	readonly startY: number;
	readonly endX: number;
	readonly endY: number;
};

export type WardleyLayout = {
	readonly map: WardleyMap;
	readonly components: readonly ComponentLayout[];
	readonly dependencies: readonly DependencyPath[];
	readonly evolutionAxis: readonly {
		stage: EvolutionStage;
		position: number;
		label: string;
	}[];
	readonly valueAxis: readonly { level: string; position: number }[];
};

// 🚨 Error types for comprehensive error handling
export type WardleyError =
	| { type: "ValidationError"; field: string; message: string }
	| { type: "CalculationError"; operation: string; message: string }
	| { type: "DependencyError"; componentId: ComponentId; message: string }
	| { type: "LayoutError"; reason: string; message: string };

// 🎯 Result type alias for readability
export type Result<T, E = WardleyError> = Either.Either<T, E>;

// 🎨 Smart constructors with validation using Effect Match
export const createComponentId = (value: string): Result<ComponentId> => {
	const trimmedValue = value?.trim() || "";

	return Match.value(trimmedValue).pipe(
		Match.when(
			(v) => v.length === 0,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "componentId",
					message: "Component ID cannot be empty",
				}),
		),
		Match.when(
			(v) => v.length > 50,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "componentId",
					message: "Component ID must be 50 characters or less",
				}),
		),
		Match.orElse((v) => Either.right(v as ComponentId)),
	);
};

export const createComponentName = (value: string): Result<ComponentName> => {
	const trimmedValue = value?.trim() || "";

	return Match.value(trimmedValue).pipe(
		Match.when(
			(v) => v.length === 0,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "componentName",
					message: "Component name cannot be empty",
				}),
		),
		Match.when(
			(v) => v.length > 100,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "componentName",
					message: "Component name must be 100 characters or less",
				}),
		),
		Match.orElse((v) => Either.right(v as ComponentName)),
	);
};

export const createEvolutionPosition = (
	value: number,
): Result<EvolutionPosition> => {
	return Match.value(value).pipe(
		Match.when(
			(v) => v < 0 || v > 1,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "evolution",
					message: "Evolution position must be between 0 and 1",
				}),
		),
		Match.orElse((v) => Either.right(v as EvolutionPosition)),
	);
};

export const createValuePosition = (value: number): Result<ValuePosition> => {
	return Match.value(value).pipe(
		Match.when(
			(v) => v < 0 || v > 1,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "value",
					message: "Value position must be between 0 and 1",
				}),
		),
		Match.orElse((v) => Either.right(v as ValuePosition)),
	);
};

export const createDependencyStrength = (
	value: number,
): Result<DependencyStrength> => {
	return Match.value(value).pipe(
		Match.when(
			(v) => v < 0 || v > 1,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "strength",
					message: "Dependency strength must be between 0 and 1",
				}),
		),
		Match.orElse((v) => Either.right(v as DependencyStrength)),
	);
};

// 🎨 Lookup tables for domain characteristics (avoiding switch statements)
export const EVOLUTION_STAGES: Record<
	EvolutionStage,
	{ position: number; label: string; description: string }
> = {
	Genesis: {
		position: 0.1,
		label: "Genesis",
		description: "Novel, uncertain, changing rapidly",
	},
	Custom: {
		position: 0.35,
		label: "Custom Built",
		description: "Emerging, best practices forming",
	},
	Product: {
		position: 0.65,
		label: "Product",
		description: "Stabilizing, good practices known",
	},
	Commodity: {
		position: 0.9,
		label: "Commodity",
		description: "Standardized, well understood",
	},
};

export const VISIBILITY_LEVELS: Record<
	VisibilityLevel,
	{ color: string; description: string; order: number }
> = {
	Visible: {
		color: "#2563eb",
		description: "Directly visible to users",
		order: 3,
	},
	Internal: {
		color: "#7c3aed",
		description: "Internal business processes",
		order: 2,
	},
	Infrastructure: {
		color: "#dc2626",
		description: "Supporting infrastructure",
		order: 1,
	},
};

export const COMPONENT_TYPES: Record<
	ComponentType,
	{ color: string; defaultSize: number; description: string }
> = {
	User: {
		color: "#059669",
		defaultSize: 8,
		description: "User needs and expectations",
	},
	Business: {
		color: "#2563eb",
		defaultSize: 6,
		description: "Business capabilities and processes",
	},
	Data: {
		color: "#7c3aed",
		defaultSize: 5,
		description: "Data and information systems",
	},
	Infrastructure: {
		color: "#dc2626",
		defaultSize: 4,
		description: "Technical infrastructure and platforms",
	},
	Anchor: {
		color: "#059669",
		defaultSize: 10,
		description: "Primary user need (map anchor)",
	},
};

export const MOVEMENT_INDICATORS: Record<
	MovementDirection,
	{ arrow: string; color: string; description: string }
> = {
	Evolving: {
		arrow: "→",
		color: "#059669",
		description: "Moving toward commodity",
	},
	Stable: {
		arrow: "●",
		color: "#6b7280",
		description: "Stable in current position",
	},
	Declining: {
		arrow: "←",
		color: "#dc2626",
		description: "Moving toward genesis",
	},
};

// 🎯 Validation functions for complex domain rules using Effect Match
export const validateWardleyComponent = (
	component: Partial<WardleyComponent>,
): Result<WardleyComponent> => {
	return Match.value(component).pipe(
		// Validate required fields
		Match.when(
			(c) => !c.id,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "id",
					message: "Component ID is required",
				}),
		),
		Match.when(
			(c) => !c.name,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "name",
					message: "Component name is required",
				}),
		),
		Match.when(
			(c) => c.evolution === undefined || c.value === undefined,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "position",
					message: "Evolution and value positions are required",
				}),
		),
		// Validate business rules
		Match.when(
			(c) => c.type === "Anchor" && c.value !== 1,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "anchor",
					message:
						"Anchor components must be at the top of the value chain (value = 1)",
				}),
		),
		Match.when(
			(c) =>
				c.visibility === "Visible" && c.value !== undefined && c.value < 0.7,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "visibility",
					message: "Visible components should be high in the value chain",
				}),
		),
		Match.orElse((c) => Either.right(c as WardleyComponent)),
	);
};

export const validateDependency = (
	dependency: ComponentDependency,
	components: readonly WardleyComponent[],
): Result<ComponentDependency> => {
	const fromComponent = components.find((c) => c.id === dependency.from);
	const toComponent = components.find((c) => c.id === dependency.to);

	const validationContext = { dependency, fromComponent, toComponent };

	return Match.value(validationContext).pipe(
		Match.when(
			({ fromComponent }) => !fromComponent,
			({ dependency }) =>
				Either.left({
					type: "DependencyError" as const,
					componentId: dependency.from,
					message: `Source component ${dependency.from} not found`,
				}),
		),
		Match.when(
			({ toComponent }) => !toComponent,
			({ dependency }) =>
				Either.left({
					type: "DependencyError" as const,
					componentId: dependency.to,
					message: `Target component ${dependency.to} not found`,
				}),
		),
		// Business rule: Dependencies should generally flow down the value chain
		Match.when(
			({ fromComponent, toComponent }) =>
				fromComponent && toComponent && fromComponent.value < toComponent.value,
			() =>
				Either.left({
					type: "ValidationError" as const,
					field: "dependency",
					message:
						"Dependencies should flow from higher to lower value components",
				}),
		),
		Match.orElse(({ dependency }) => Either.right(dependency)),
	);
};

// 🎪 Helper functions for component creation using Either.all for better composition
export const createAnchorComponent = (
	name: string,
): Result<WardleyComponent> => {
	const idResult = createComponentId(
		`anchor-${name.toLowerCase().replace(/\s+/g, "-")}`,
	);
	const nameResult = createComponentName(name);

	// Use Either.all to combine results - fails fast on first error
	return Either.all({ id: idResult, name: nameResult }).pipe(
		Either.map(({ id, name }) => ({
			id,
			name,
			evolution: 0.5 as EvolutionPosition,
			value: 1.0 as ValuePosition,
			stage: "Custom" as EvolutionStage,
			visibility: "Visible" as VisibilityLevel,
			type: "Anchor" as ComponentType,
			size: 10,
			dependencies: [],
		})),
	);
};

// 🎯 Export configuration constants
export const WARDLEY_CONFIG = {
	DEFAULT_WIDTH: 900,
	DEFAULT_HEIGHT: 600,
	MIN_WIDTH: 600,
	MIN_HEIGHT: 400,
	COMPONENT_MIN_RADIUS: 8,
	COMPONENT_MAX_RADIUS: 25,
	DEPENDENCY_STROKE_WIDTH: 2,
	EVOLUTION_STAGES: 4,
	VALUE_LEVELS: 5,
	PADDING: 60,
	AXIS_LABEL_HEIGHT: 40,
} as const;

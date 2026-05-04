import { Either, Match, Schema, flow, pipe } from "effect";
import { Array as EffectArray, Option } from "effect";
import { assign, setup } from "xstate";

/**
 * Balanced Coupling Explorer State Machine
 *
 * This module demonstrates functional programming with Effect's Match API
 * integrated with XState 5 for state management. The architecture follows
 * the "functional core, imperative shell" pattern:
 *
 * - Functional Core: Pure functions using Effect Match for pattern matching
 * - Imperative Shell: XState machine for side effects and UI state
 *
 * Key Effect patterns used:
 * - Match.tag() for discriminated union handling
 * - Match.when() for conditional logic
 * - Match.value().pipe() for functional composition
 * - Match.exhaustive for compile-time completeness checking
 * - Schema for validation and type safety
 */

// Types for the machine
type PresetScenario = {
	name: string;
	strength: number;
	distance: number;
	volatility: number;
	description: string;
};

// New type for system examples
export type SystemExample = {
	readonly name: string;
	readonly description: string;
	readonly strength: [number, number]; // Range
	readonly distance: [number, number]; // Range
	readonly volatility: [number, number]; // Range
	readonly riskLevel: 'low' | 'medium' | 'high';
	readonly recommendation: string;
};

// System examples based on the book concepts
export const systemExamples: SystemExample[] = [
	{
		name: "Stable API Integration",
		description: "Contract-based integration with stable external service",
		strength: [1, 3],
		distance: [8, 10],
		volatility: [1, 3],
		riskLevel: 'low',
		recommendation: "Maintain clean interfaces and versioning"
	},
	{
		name: "Core Domain with Intrusive Coupling",
		description: "High volatility business logic with tight integration",
		strength: [8, 10],
		distance: [1, 3],
		volatility: [8, 10],
		riskLevel: 'high',
		recommendation: "Refactor to reduce coupling, add anti-corruption layers"
	},
	{
		name: "Supporting Domain with Functional Coupling",
		description: "Low volatility utility modules with loose coupling",
		strength: [1, 4],
		distance: [3, 6],
		volatility: [1, 3],
		riskLevel: 'low',
		recommendation: "Good architecture, maintain separation"
	},
	{
		name: "Cross-Service Core Domain",
		description: "High volatility business logic across service boundaries",
		strength: [5, 7],
		distance: [7, 9],
		volatility: [7, 10],
		riskLevel: 'medium',
		recommendation: "Consider event-driven architecture to reduce coupling"
	},
	{
		name: "Generic Subdomain with Tight Coupling",
		description: "Low volatility but unnecessarily tight integration",
		strength: [7, 9],
		distance: [2, 4],
		volatility: [2, 4],
		riskLevel: 'medium',
		recommendation: "Refactor to reduce coupling, not urgent but technical debt"
	},
];

// Define a schema for the parameters with proper validation
export const BalancedCouplingParamsSchema = Schema.Struct({
	strength: Schema.Number.pipe(Schema.between(1, 10)),
	distance: Schema.Number.pipe(Schema.between(1, 10)),
	volatility: Schema.Number.pipe(Schema.between(1, 10)),
});

// Extract the type from the schema
export type BalancedCouplingParams = typeof BalancedCouplingParamsSchema.Type;

type Context = {
	strength: number;
	distance: number;
	volatility: number;
	activePreset: string | null;
};

// XState event types (required for XState compatibility)
type Events =
	| { type: "SET_STRENGTH"; value: number }
	| { type: "SET_DISTANCE"; value: number }
	| { type: "SET_VOLATILITY"; value: number }
	| { type: "APPLY_PRESET"; preset: PresetScenario }
	| { type: "CLEAR_ACTIVE_PRESET" };

// Effect-style tagged union for functional event handling
type EffectEvent =
	| { _tag: "SET_STRENGTH"; value: number }
	| { _tag: "SET_DISTANCE"; value: number }
	| { _tag: "SET_VOLATILITY"; value: number }
	| { _tag: "APPLY_PRESET"; preset: PresetScenario }
	| { _tag: "CLEAR_ACTIVE_PRESET" };

// Preset scenarios data (functional core)
export const presetScenarios: PresetScenario[] = [
	{
		name: "Legacy Integration",
		strength: 8,
		distance: 2,
		volatility: 2,
		description: "High coupling, same system, stable",
	},
	{
		name: "Cross-Vendor API",
		strength: 1,
		distance: 10,
		volatility: 8,
		description: "Contract only, external, volatile",
	},
	{
		name: "Microservice Boundary",
		strength: 3,
		distance: 9,
		volatility: 5,
		description: "Model coupling, different services",
	},
	{
		name: "Monolith Module",
		strength: 9,
		distance: 1,
		volatility: 3,
		description: "Tight coupling, same object, stable",
	},
	{
		name: "Third-Party Library",
		strength: 2,
		distance: 8,
		volatility: 1,
		description: "Interface coupling, external, stable",
	},
];

// Pure functions for calculations (functional core)
export const calculateModularity = (
	strength: number,
	distance: number,
): number => Math.abs(strength - distance) + 1;

export const calculateBalance = (
	modularity: number,
	volatility: number,
): number => Math.max(modularity, 10 - volatility + 1);

// Reusable function pipeline for finding preset names (functional core)
const findPresetNamePipeline = (
	predicate: (preset: PresetScenario) => boolean,
) =>
	flow(
		EffectArray.findFirst(predicate),
		Option.map((preset: PresetScenario) => preset.name),
		Option.getOrNull,
	);

// Pure function to find matching preset using flow composition
export const findMatchingPreset = (
	strength: number,
	distance: number,
	volatility: number,
): string | null => {
	const isExactParameterMatch = (preset: PresetScenario): boolean =>
		preset.strength === strength &&
		preset.distance === distance &&
		preset.volatility === volatility;

	return findPresetNamePipeline(isExactParameterMatch)(presetScenarios);
};

// Pure function for feedback generation (functional core)
export const generateFeedback = (
	modularity: number,
	volatility: number,
	balance: number,
): string => {
	// Feedback configuration using domain-specific types
	const modularityFeedbackConfig: CouplingParameterConfig<ModularityScore> = {
		parameterKind: "CouplingStrength", // Reuse for type compatibility
		ranges: [
			createRange<ModularityScore>(
				1,
				2,
				"Very poor modularity. Strongly consider decoupling.",
			),
			createRange<ModularityScore>(
				3,
				4,
				"Poor modularity. High risk of complexity.",
			),
			createRange<ModularityScore>(
				5,
				6,
				"Moderate modularity. Some risk present.",
			),
			createRange<ModularityScore>(
				7,
				8,
				"Good modularity. Acceptable for most cases.",
			),
			createRange<ModularityScore>(9, 10, "Excellent modularity. Low risk."),
		],
	};

	const volatilityFeedbackConfig: CouplingParameterConfig<CouplingVolatility> =
		{
			parameterKind: "CouplingVolatility",
			ranges: [
				createRange<CouplingVolatility>(
					1,
					3,
					"Low volatility: changes are rare.",
				),
				createRange<CouplingVolatility>(4, 6, "Moderate volatility."),
				createRange<CouplingVolatility>(
					7,
					8,
					"High volatility: changes are frequent.",
				),
				createRange<CouplingVolatility>(
					9,
					10,
					"Very high volatility: expect frequent changes.",
				),
			],
		};

	// Extract feedback using domain-specific pattern
	const modularityFeedback = getParameterDescription(
		modularity,
		modularityFeedbackConfig,
	).replace("Current: ", "");
	const volatilityFeedback = getParameterDescription(
		volatility,
		volatilityFeedbackConfig,
	)
		.replace("Current: ", "")
		.replace(` (${volatility}/10)`, "");

	// Named boolean conditions for clarity
	const isHighVolatilityImbalance = balance > modularity && volatility >= 7;
	const isRobustAndResilient = balance === modularity && modularity >= 8;
	const isLowBalance = balance < 5;

	const balanceText = Match.value({
		isHighVolatilityImbalance,
		isRobustAndResilient,
		isLowBalance,
	}).pipe(
		Match.when(
			{ isHighVolatilityImbalance: true },
			() =>
				"Balance is higher than modularity due to high volatility. Consider decoupling or isolating this module.",
		),
		Match.when(
			{ isRobustAndResilient: true },
			() => "Architecture is robust and resilient to change.",
		),
		Match.when(
			{ isLowBalance: true },
			() =>
				"Balance is low. This module is at risk for maintainability issues.",
		),
		Match.orElse(() => "Balance is acceptable for most scenarios."),
	);

	return [modularityFeedback, volatilityFeedback, balanceText].join(" ");
};

// Domain-driven types inspired by F# domain modeling (functional core)

// Branded types for domain values - make illegal states unrepresentable
type CouplingStrength = number & { readonly __brand: "CouplingStrength" };
type CouplingDistance = number & { readonly __brand: "CouplingDistance" };
type CouplingVolatility = number & { readonly __brand: "CouplingVolatility" };
type ParameterDescription = string & {
	readonly __brand: "ParameterDescription";
};

// Union type for all coupling parameters
type CouplingParameterValue =
	| CouplingStrength
	| CouplingDistance
	| CouplingVolatility
	| ModularityScore;

// ModularityScore domain type
type ModularityScore = number & { readonly __brand: "ModularityScore" };

// Domain-specific range type with proper value semantics
type CouplingParameterRange<T extends CouplingParameterValue> = {
	readonly minValue: T;
	readonly maxValue: T;
	readonly description: ParameterDescription;
};

// Discriminated union for parameter kinds - F# style
type CouplingParameterKind =
	| "CouplingStrength"
	| "CouplingDistance"
	| "CouplingVolatility";

// Configuration becomes domain-specific and type-safe
type CouplingParameterConfig<T extends CouplingParameterValue> = {
	readonly parameterKind: CouplingParameterKind;
	readonly ranges: readonly CouplingParameterRange<T>[];
};

// Smart constructors for domain values (F# inspired)
const createParameterDescription = (text: string): ParameterDescription =>
	text as ParameterDescription;

// Additional smart constructors available for future use:
// const createCouplingStrength = (value: number): CouplingStrength => value as CouplingStrength;
// const createCouplingDistance = (value: number): CouplingDistance => value as CouplingDistance;
// const createCouplingVolatility = (value: number): CouplingVolatility => value as CouplingVolatility;

// Helper to create ranges with proper domain types
const createRange = <T extends CouplingParameterValue>(
	min: number,
	max: number,
	description: string,
): CouplingParameterRange<T> => ({
	minValue: min as T,
	maxValue: max as T,
	description: createParameterDescription(description),
});

const strengthConfig: CouplingParameterConfig<CouplingStrength> = {
	parameterKind: "CouplingStrength",
	ranges: [
		createRange<CouplingStrength>(1, 2, "Contract coupling (APIs only)"),
		createRange<CouplingStrength>(
			3,
			5,
			"Model coupling (shared types/schemas)",
		),
		createRange<CouplingStrength>(
			6,
			8,
			"Functional coupling (uses internal logic)",
		),
		createRange<CouplingStrength>(
			9,
			9,
			"Symmetric functional (mutual logic sharing)",
		),
		createRange<CouplingStrength>(
			10,
			10,
			"Intrusive coupling (deep entanglement)",
		),
	],
};

const distanceConfig: CouplingParameterConfig<CouplingDistance> = {
	parameterKind: "CouplingDistance",
	ranges: [
		createRange<CouplingDistance>(1, 1, "Same object"),
		createRange<CouplingDistance>(2, 2, "Same namespace/package"),
		createRange<CouplingDistance>(3, 7, "Different namespaces/packages"),
		createRange<CouplingDistance>(8, 8, "Different libraries"),
		createRange<CouplingDistance>(9, 9, "Different services (same org)"),
		createRange<CouplingDistance>(10, 10, "Different vendors"),
	],
};

const volatilityConfig: CouplingParameterConfig<CouplingVolatility> = {
	parameterKind: "CouplingVolatility",
	ranges: [
		createRange<CouplingVolatility>(1, 2, "Legacy/stable"),
		createRange<CouplingVolatility>(3, 6, "Supporting/generic subdomain"),
		createRange<CouplingVolatility>(
			7,
			10,
			"Core subdomain or inferred high volatility",
		),
	],
};

// Reusable pipeline for finding parameter descriptions (functional core)
const findDescriptionPipeline = <T extends CouplingParameterValue>(
	predicate: (range: CouplingParameterRange<T>) => boolean,
) =>
	flow(
		EffectArray.findFirst<CouplingParameterRange<T>>(predicate),
		Option.map((range: CouplingParameterRange<T>) => range.description),
		Option.getOrElse(() => createParameterDescription("Unknown range")),
	);

// Generic parameter description function using flow composition
const getParameterDescription = <T extends CouplingParameterValue>(
	value: number,
	config: CouplingParameterConfig<T>,
): string => {
	const typedValue = value as T;
	const isValueInRange = (range: CouplingParameterRange<T>) =>
		typedValue >= range.minValue && typedValue <= range.maxValue;

	const pipeline = findDescriptionPipeline<T>(isValueInRange);
	const matchingRange = pipeline(config.ranges);

	return `Current: ${matchingRange} (${value}/10)`;
};

// Pure functions for tooltip descriptions using consolidated pattern
export const getStrengthDescription = (value: number): string =>
	getParameterDescription(value, strengthConfig);

export const getDistanceDescription = (value: number): string =>
	getParameterDescription(value, distanceConfig);

export const getVolatilityDescription = (value: number): string =>
	getParameterDescription(value, volatilityConfig);

// Effect-style functional event handlers using Match
const handleContextUpdate = (context: Context, event: EffectEvent): Context =>
	Match.value(event).pipe(
		Match.tag("SET_STRENGTH", ({ value }) => ({
			...context,
			strength: value,
			activePreset: findMatchingPreset(
				value,
				context.distance,
				context.volatility,
			),
		})),
		Match.tag("SET_DISTANCE", ({ value }) => ({
			...context,
			distance: value,
			activePreset: findMatchingPreset(
				context.strength,
				value,
				context.volatility,
			),
		})),
		Match.tag("SET_VOLATILITY", ({ value }) => ({
			...context,
			volatility: value,
			activePreset: findMatchingPreset(
				context.strength,
				context.distance,
				value,
			),
		})),
		Match.tag("APPLY_PRESET", ({ preset }) => ({
			...context,
			strength: preset.strength,
			distance: preset.distance,
			volatility: preset.volatility,
			activePreset: preset.name,
		})),
		Match.tag("CLEAR_ACTIVE_PRESET", () => ({
			...context,
			activePreset: null,
		})),
		Match.exhaustive,
	);

// Convert XState events to Effect events for functional handling
const toEffectEvent = (event: Events): EffectEvent =>
	Match.value(event).pipe(
		Match.when({ type: "SET_STRENGTH" }, ({ value }) => ({
			_tag: "SET_STRENGTH" as const,
			value,
		})),
		Match.when({ type: "SET_DISTANCE" }, ({ value }) => ({
			_tag: "SET_DISTANCE" as const,
			value,
		})),
		Match.when({ type: "SET_VOLATILITY" }, ({ value }) => ({
			_tag: "SET_VOLATILITY" as const,
			value,
		})),
		Match.when({ type: "APPLY_PRESET" }, ({ preset }) => ({
			_tag: "APPLY_PRESET" as const,
			preset,
		})),
		Match.when({ type: "CLEAR_ACTIVE_PRESET" }, () => ({
			_tag: "CLEAR_ACTIVE_PRESET" as const,
		})),
		Match.exhaustive,
	);

// Functional state updater using Effect Match
export const updateContextFunctionally = (
	context: Context,
	event: Events,
): Context => {
	const effectEvent = toEffectEvent(event);
	return handleContextUpdate(context, effectEvent);
};

// Effect-style validation functions using Schema
export const validateContextValues = (context: Context): boolean => {
	// Extract just the parameters we need to validate
	const params = {
		strength: context.strength,
		distance: context.distance,
		volatility: context.volatility,
	};

	// Use pipe for functional composition
	return pipe(
		params,
		Schema.decodeUnknownEither(BalancedCouplingParamsSchema),
		Either.isRight,
	);
};

// For equality checks when needed
export const paramsEqual = Schema.equivalence(BalancedCouplingParamsSchema);

// Function to find matching system examples based on current parameters
export const findMatchingSystemExamples = (
	strength: number,
	distance: number,
	volatility: number
): SystemExample[] => {
	return systemExamples.filter(example =>
		strength >= example.strength[0] && strength <= example.strength[1] &&
		distance >= example.distance[0] && distance <= example.distance[1] &&
		volatility >= example.volatility[0] && volatility <= example.volatility[1]
	);
};

// Effect-style context analyzer using functional composition
export const analyzeContext = (context: Context) => {
	const modularity = calculateModularity(context.strength, context.distance);
	const balance = calculateBalance(modularity, context.volatility);
	const feedback = generateFeedback(modularity, context.volatility, balance);
	const matchingExamples = findMatchingSystemExamples(
		context.strength,
		context.distance,
		context.volatility
	);

	return {
		modularity,
		balance,
		feedback,
		isValid: validateContextValues(context),
		hasActivePreset: context.activePreset !== null,
		currentPreset: findMatchingPreset(
			context.strength,
			context.distance,
			context.volatility,
		),
		matchingExamples,
	};
};

// XState 5 machine setup
export const balancedCouplingMachine = setup({
	types: {
		context: {} as Context,
		events: {} as Events,
	},
	// Guards removed since all logic is now handled in updateContextFunctionally
	actions: {
		// Consolidated universal action using Effect Match
		updateContext: assign(({ context, event }) =>
			updateContextFunctionally(context, event),
		),
	},
}).createMachine({
	id: "balancedCoupling",
	initial: "idle",
	context: {
		strength: 3,
		distance: 10,
		volatility: 10,
		activePreset: null,
	},
	states: {
		idle: {
			// All event handling moved to root level to eliminate duplication
		},
	},
	on: {
		// Consolidated event handling with single universal action
		SET_STRENGTH: {
			actions: ["updateContext"],
		},
		SET_DISTANCE: {
			actions: ["updateContext"],
		},
		SET_VOLATILITY: {
			actions: ["updateContext"],
		},
		APPLY_PRESET: {
			actions: ["updateContext"],
		},
		CLEAR_ACTIVE_PRESET: {
			actions: ["updateContext"],
		},
	},
});

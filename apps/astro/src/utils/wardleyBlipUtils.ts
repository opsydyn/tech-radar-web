// Utility functions for working with Wardley mapping data from blips
// Following functional programming patterns from CLAUDE.md

import type { CollectionEntry } from "astro:content";
import { Either } from "effect";
import type {
	ComponentDependency,
	ComponentId,
	ComponentName,
	EvolutionPosition,
	ValuePosition,
	WardleyComponent,
	WardleyMap,
} from "../components/wardley.types";
import { createDependencyStrength } from "../components/wardley.types";
import type {
	WardleyComponent as ContentWardleyComponent,
	WardleyComponentType,
	WardleyEvolutionStage,
	WardleyVisibility,
} from "../content/config";
import { getBlipPath } from "./blipRouting";

// 🎯 Types for blip integration
type BlipEntry = CollectionEntry<"blip">;
type BlipWithWardley = BlipEntry & {
	data: BlipEntry["data"] & {
		wardley: ContentWardleyComponent;
	};
};

// 🚨 Error types for comprehensive error handling
type WardleyBlipError =
	| { type: "ValidationError"; field: string; message: string }
	| { type: "TransformationError"; blipId: string; message: string }
	| { type: "DependencyError"; blipId: string; missingDeps: string[] };

type Result<T> = Either.Either<T, WardleyBlipError>;

// 🎨 Pure transformation functions
const transformBlipToWardleyComponent = (
	blip: BlipWithWardley,
): Result<WardleyComponent> => {
	try {
		const wardleyData = blip.data.wardley;

		return Either.right({
			id: blip.data.id as ComponentId,
			name: blip.data.name as ComponentName,
			evolution: wardleyData.position.evolution as EvolutionPosition,
			value: wardleyData.position.value as ValuePosition,
			stage: wardleyData.stage as WardleyEvolutionStage,
			visibility: wardleyData.visibility as WardleyVisibility,
			type: wardleyData.componentType as WardleyComponentType,
			movement: wardleyData.movement,
			size: wardleyData.size,
			dependencies: (wardleyData.dependencies || []) as ComponentId[],
		});
	} catch (error) {
		return Either.left({
			type: "TransformationError",
			blipId: blip.data.id,
			message: `Failed to transform blip to Wardley component: ${error instanceof Error ? error.message : "Unknown error"}`,
		});
	}
};

// 🔍 Pure filtering function
const filterBlipsWithWardley = (blips: BlipEntry[]): BlipWithWardley[] => {
	return blips.filter(
		(blip): blip is BlipWithWardley => blip.data.wardley !== undefined,
	);
};

// 🔗 Pure function to create dependencies from blip relationships
const createDependenciesFromBlips = (
	blipsWithWardley: BlipWithWardley[],
): ComponentDependency[] => {
	const dependencies: ComponentDependency[] = [];

	for (const blip of blipsWithWardley) {
		const wardleyDeps = blip.data.wardley.dependencies || [];

		for (const depId of wardleyDeps) {
			// Check if the dependency exists in our blips
			const depExists = blipsWithWardley.some((b) => b.data.id === depId);

			if (depExists) {
				const strengthResult = createDependencyStrength(0.7);
				if (Either.isRight(strengthResult)) {
					dependencies.push({
						from: blip.data.id as ComponentId,
						to: depId as ComponentId,
						strength: strengthResult.right,
						type: "DataFlow", // Default type, could be inferred from relationship
					});
				}
			}
		}
	}

	return dependencies;
};

// 🗺️ Main function to create WardleyMap from blips
export const createWardleyMapFromBlips = (
	allBlips: BlipEntry[],
	title = "Tech Radar - Strategic Map",
): Result<WardleyMap> => {
	const blipsWithWardley = filterBlipsWithWardley(allBlips);

	if (blipsWithWardley.length === 0) {
		return Either.left({
			type: "ValidationError",
			field: "blips",
			message: "No blips found with Wardley mapping data",
		});
	}

	// Transform all blips to Wardley components
	const componentResults = blipsWithWardley.map(
		transformBlipToWardleyComponent,
	);

	// Check for transformation errors
	const errors = componentResults.filter(Either.isLeft);
	if (errors.length > 0) {
		return Either.left(errors[0].left);
	}

	// Extract successful transformations
	const components = componentResults
		.filter(Either.isRight)
		.map((result) => result.right);

	// Create dependencies
	const dependencies = createDependenciesFromBlips(blipsWithWardley);

	// Find anchor component (highest value, or first User/Anchor type)
	const anchor =
		components.find((c) => c.type === "Anchor") ||
		components.find((c) => c.type === "User") ||
		components.reduce((prev, current) =>
			current.value > prev.value ? current : prev,
		);

	return Either.right({
		title,
		components,
		dependencies,
		anchor: anchor.id,
		width: 900,
		height: 600,
	});
};

// 🎪 Helper function to create component-to-blip URL mapping
export const createComponentToBlipMapping = (
	blipsWithWardley: BlipWithWardley[],
): Record<string, string> => {
	return Object.fromEntries(
		blipsWithWardley.map((blip) => [blip.data.id, getBlipPath(blip.data)]),
	);
};

// 📊 Analytics functions for strategic insights
export const analyzeWardleyBlips = (blips: BlipEntry[]) => {
	const blipsWithWardley = filterBlipsWithWardley(blips);

	const stageDistribution = blipsWithWardley.reduce(
		(acc, blip) => {
			const stage = blip.data.wardley.stage;
			acc[stage] = (acc[stage] || 0) + 1;
			return acc;
		},
		{} as Record<WardleyEvolutionStage, number>,
	);

	const visibilityDistribution = blipsWithWardley.reduce(
		(acc, blip) => {
			const visibility = blip.data.wardley.visibility;
			acc[visibility] = (acc[visibility] || 0) + 1;
			return acc;
		},
		{} as Record<WardleyVisibility, number>,
	);

	const evolvingComponents = blipsWithWardley.filter(
		(blip) => blip.data.wardley.movement === "Evolving",
	);

	return {
		totalComponents: blipsWithWardley.length,
		stageDistribution,
		visibilityDistribution,
		evolvingComponents: evolvingComponents.map((b) => ({
			id: b.data.id,
			name: b.data.name,
			stage: b.data.wardley.stage,
			strategicNotes: b.data.wardley.strategicNotes,
		})),
	};
};

// 🎯 Validation function for Wardley data consistency
export const validateWardleyConsistency = (
	blips: BlipEntry[],
): Result<{ valid: boolean; issues: string[] }> => {
	const blipsWithWardley = filterBlipsWithWardley(blips);
	const issues: string[] = [];

	// Check for missing dependencies
	for (const blip of blipsWithWardley) {
		const deps = blip.data.wardley.dependencies || [];
		const missingDeps = deps.filter(
			(depId) => !blipsWithWardley.some((b) => b.data.id === depId),
		);

		if (missingDeps.length > 0) {
			issues.push(
				`Blip "${blip.data.name}" references missing dependencies: ${missingDeps.join(", ")}`,
			);
		}
	}

	// Check for value chain consistency (dependencies should flow down)
	for (const blip of blipsWithWardley) {
		const deps = blip.data.wardley.dependencies || [];
		for (const depId of deps) {
			const depBlip = blipsWithWardley.find((b) => b.data.id === depId);
			if (
				depBlip &&
				depBlip.data.wardley.position.value >= blip.data.wardley.position.value
			) {
				issues.push(
					`Value chain inconsistency: "${blip.data.name}" depends on "${depBlip.data.name}" but has equal/higher value`,
				);
			}
		}
	}

	return Either.right({
		valid: issues.length === 0,
		issues,
	});
};

// 🎪 Export configuration constants
export const WARDLEY_BLIP_CONFIG = {
	DEFAULT_DEPENDENCY_STRENGTH: 0.7,
	DEFAULT_MAP_DIMENSIONS: { width: 900, height: 600 },
	SUPPORTED_DEPENDENCY_TYPES: ["DataFlow", "ValueFlow", "Control"] as const,
} as const;

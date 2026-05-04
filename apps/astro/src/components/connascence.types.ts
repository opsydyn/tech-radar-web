// Domain types for Connascence Chart visualization
// Following functional programming patterns from CLAUDE.md

import { Either } from "effect";

// 🏷️ Branded types for type safety
export type ConnascenceType = string & { readonly _brand: "ConnascenceType" };
export type SeverityLevel = number & { readonly _brand: "SeverityLevel" };
export type SeverityCategory = "low" | "medium" | "high";
export type ConnascenceDescription = string & {
	readonly _brand: "ConnascenceDescription";
};

// 🎯 Smart constructors with validation
export const createConnascenceType = (
	value: string,
): Either.Either<ConnascenceType, ConnascenceError> => {
	if (!value || value.trim().length === 0) {
		return Either.left({
			type: "ValidationError",
			field: "connascenceType",
			message: "Connascence type cannot be empty",
		});
	}
	return Either.right(value.trim() as ConnascenceType);
};

export const createSeverityLevel = (
	value: number,
): Either.Either<SeverityLevel, ConnascenceError> => {
	if (value < 1 || value > 10) {
		return Either.left({
			type: "ValidationError",
			field: "severityLevel",
			message: "Severity level must be between 1 and 10",
		});
	}
	return Either.right(value as SeverityLevel);
};

export const createConnascenceDescription = (
	value: string,
): Either.Either<ConnascenceDescription, ConnascenceError> => {
	if (!value || value.trim().length === 0) {
		return Either.left({
			type: "ValidationError",
			field: "description",
			message: "Description cannot be empty",
		});
	}
	return Either.right(value.trim() as ConnascenceDescription);
};

// 🎭 Error types using discriminated unions
export type ConnascenceError =
	| { type: "ValidationError"; field: string; message: string }
	| { type: "CalculationError"; operation: string; message: string }
	| { type: "RenderError"; component: string; message: string };

// 📊 Core domain types
export type ConnascenceEntry = {
	readonly type: ConnascenceType;
	readonly description: ConnascenceDescription;
	readonly severity: SeverityLevel;
	readonly category: SeverityCategory;
	readonly color: string;
	readonly examples: readonly string[];
};

export type ConnascenceData = {
	readonly entries: readonly ConnascenceEntry[];
	readonly maxSeverity: SeverityLevel;
	readonly categories: readonly SeverityCategory[];
};

// 🎨 Lookup tables for domain logic
export const CONNASCENCE_DEFINITIONS = {
	"Connascence of Name": {
		description: "both must agree on a name (e.g., method name)",
		severity: 2,
		category: "low" as SeverityCategory,
		examples: ["method names", "variable names", "class names"],
	},
	"Connascence of Type": {
		description:
			"both must agree on a data type (e.g., passing a string vs an int)",
		severity: 3,
		category: "low" as SeverityCategory,
		examples: ["parameter types", "return types", "data structures"],
	},
	"Connascence of Meaning": {
		description:
			'both must agree on a semantic meaning (e.g., "N" = new, "X" = expired)',
		severity: 5,
		category: "medium" as SeverityCategory,
		examples: ["magic numbers", "boolean flags", "status codes"],
	},
	"Connascence of Position": {
		description: "meaning tied to order (e.g., parameter positions)",
		severity: 6,
		category: "medium" as SeverityCategory,
		examples: ["parameter order", "array indices", "tuple positions"],
	},
	"Connascence of Algorithm": {
		description: "both must implement same logic (e.g., checksum, encryption)",
		severity: 7,
		category: "medium" as SeverityCategory,
		examples: ["hashing algorithms", "validation rules", "business logic"],
	},
	"Connascence of Execution": {
		description: "both must be invoked in a specific order",
		severity: 8,
		category: "high" as SeverityCategory,
		examples: [
			"initialization order",
			"method call sequence",
			"lifecycle events",
		],
	},
	"Connascence of Timing": {
		description: "both must run at specific time intervals",
		severity: 9,
		category: "high" as SeverityCategory,
		examples: ["polling intervals", "timeout values", "scheduled tasks"],
	},
	"Connascence of Identity": {
		description: "both depend on the same instance (e.g., shared singleton)",
		severity: 10,
		category: "high" as SeverityCategory,
		examples: ["singleton instances", "shared state", "global variables"],
	},
} as const;

export const SEVERITY_COLORS = {
	low: "#4CAF50",
	medium: "#FF9800",
	high: "#F44336",
} as const;

export const SEVERITY_THRESHOLDS = {
	low: { min: 1, max: 4 },
	medium: { min: 5, max: 7 },
	high: { min: 8, max: 10 },
} as const;

// 🏗️ Smart constructor for complete connascence entry
export const createConnascenceEntry = (
	type: string,
	description: string,
	severity: number,
	category: SeverityCategory,
	examples: string[] = [],
): Either.Either<ConnascenceEntry, ConnascenceError> => {
	const typeResult = createConnascenceType(type);
	const descResult = createConnascenceDescription(description);
	const severityResult = createSeverityLevel(severity);

	if (Either.isLeft(typeResult)) return Either.left(typeResult.left);
	if (Either.isLeft(descResult)) return Either.left(descResult.left);
	if (Either.isLeft(severityResult)) return Either.left(severityResult.left);

	return Either.right({
		type: typeResult.right,
		description: descResult.right,
		severity: severityResult.right,
		category,
		color: SEVERITY_COLORS[category],
		examples: examples as readonly string[],
	});
};

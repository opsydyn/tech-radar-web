// Service layer for UbiquitousLanguageCloud data operations
// Following CLAUDE.md standards: service layer for business operations

import { Data, Effect, pipe } from "effect";
import { DDD_TERMS } from "./UbiquitousLanguageCloud.data";
import type { TooltipDefinition } from "./UbiquitousLanguageCloud.data";
import { DDD_DEFINITIONS } from "./UbiquitousLanguageCloud.definitions";
import { createWordData } from "./UbiquitousLanguageCloud.domain";
import type { WordData } from "./UbiquitousLanguageCloud.domain";

// ============================================================================
// Service Layer Error Types (Specific Domain Errors)
// ============================================================================

export class ServiceError extends Data.TaggedError("ServiceError")<{
	readonly message: string;
	readonly operation: string;
}> {}

export class TermDefinitionError extends Data.TaggedError(
	"TermDefinitionError",
)<{
	readonly term: string;
	readonly reason: string;
}> {}

export class WordCreationError extends Data.TaggedError("WordCreationError")<{
	readonly term: string;
	readonly validationErrors: readonly string[];
}> {}

export class DataIntegrityError extends Data.TaggedError("DataIntegrityError")<{
	readonly operation: string;
	readonly details: string;
}> {}

// ============================================================================
// Service Functions for Data Operations
// ============================================================================

/**
 * Creates validated DDD terms using Effect composition
 * Pure function that transforms raw data into domain objects with proper error handling
 */
export const createDDDTerms = (): Effect.Effect<
	readonly WordData[],
	WordCreationError
> => {
	return pipe(
		Effect.succeed(DDD_TERMS),
		Effect.flatMap((terms) =>
			Effect.forEach(terms, (term) =>
				pipe(
					createWordData(term.text, term.value, term.category),
					Effect.mapError(
						(validationError) =>
							new WordCreationError({
								term: term.text,
								validationErrors: [validationError.message],
							}),
					),
				),
			),
		),
		Effect.map((words) => words as readonly WordData[]),
		Effect.catchAll((error) => {
			// Log error and return empty array for graceful degradation
			console.warn("Failed to create DDD terms:", error);
			return Effect.succeed([]);
		}),
	);
};

/**
 * Synchronous version for compatibility with existing machine
 * TODO: Update machine to use Effect context
 */
export const createDDDTermsSync = (): readonly WordData[] => {
	return Effect.runSync(createDDDTerms());
};

/**
 * Gets tooltip definition for a given term using Effect composition
 * Pure function for definition lookup with proper error handling
 */
export const getTermDefinition = (
	term: string,
): Effect.Effect<TooltipDefinition, TermDefinitionError> => {
	return pipe(
		Effect.succeed(term),
		Effect.flatMap((searchTerm) => {
			const definition = DDD_DEFINITIONS[searchTerm];
			return definition
				? Effect.succeed(definition)
				: Effect.fail(
						new TermDefinitionError({
							term: searchTerm,
							reason: `No definition found for term: ${searchTerm}`,
						}),
					);
		}),
	);
};

/**
 * Synchronous version for compatibility with existing machine
 * TODO: Update machine to use Effect context
 */
export const getTermDefinitionSync = (term: string) => {
	return pipe(
		getTermDefinition(term),
		Effect.match({
			onSuccess: (definition) => definition,
			onFailure: () => null,
		}),
		Effect.runSync,
	);
};

/**
 * Gets all available term definitions
 * Pure function for accessing all definitions
 */
export const getAllDefinitions = () => {
	return DDD_DEFINITIONS;
};

/**
 * Validates that all terms have corresponding definitions
 * Pure function for data integrity checking
 */
export const validateDataIntegrity = (): {
	readonly termsWithoutDefinitions: readonly string[];
	readonly definitionsWithoutTerms: readonly string[];
	readonly isValid: boolean;
} => {
	const termTexts = new Set(DDD_TERMS.map((term) => term.text));
	const definitionKeys = new Set(Object.keys(DDD_DEFINITIONS));

	const termsWithoutDefinitions = DDD_TERMS.filter(
		(term) => !definitionKeys.has(term.text),
	).map((term) => term.text);

	const definitionsWithoutTerms = Object.keys(DDD_DEFINITIONS).filter(
		(key) => !termTexts.has(key),
	);

	const isValid =
		termsWithoutDefinitions.length === 0 &&
		definitionsWithoutTerms.length === 0;

	return {
		termsWithoutDefinitions,
		definitionsWithoutTerms,
		isValid,
	};
};

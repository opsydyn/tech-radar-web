// XState machine for UbiquitousLanguageCloud component
// Following CLAUDE.md standards: functional state management with Effect integration

import { Effect, Match, Option, pipe } from "effect";
import { type ActorRefFrom, assign, createMachine } from "xstate";
import type { TooltipDefinition } from "./UbiquitousLanguageCloud.data";
import type {
	LayoutConstraints,
	PositionedWord,
	WordData,
} from "./UbiquitousLanguageCloud.domain";
import { createWordCloud } from "./UbiquitousLanguageCloud.domain";
import {
	createDDDTermsSync,
	getTermDefinitionSync,
} from "./UbiquitousLanguageCloud.service";

// Domain constants for consistent dimensions
const DEFAULT_DIMENSIONS = {
	width: 900,
	height: 600,
} as const;

// ============================================================================
// Machine Context Types (Domain-Driven State Management)
// ============================================================================

export type WordCloudContext = {
	// Core domain data
	readonly words: readonly PositionedWord[];
	readonly rawWords: readonly WordData[];

	// Layout configuration
	readonly dimensions: {
		readonly width: number;
		readonly height: number;
	};
	readonly constraints: LayoutConstraints;

	// Tooltip state
	readonly tooltipData: {
		readonly term: string;
		readonly definition: TooltipDefinition;
		readonly position: { readonly x: number; readonly y: number };
	} | null;

	// Error handling
	readonly error: string | null;
};

// ============================================================================
// Event Types (Discriminated Union - No Boolean Blindness)
// ============================================================================

export type WordCloudEvent =
	| { type: "LOAD_WORDS"; dimensions: { width: number; height: number } }
	| { type: "WORDS_LOADED"; words: readonly PositionedWord[] }
	| { type: "WORDS_FAILED"; error: string }
	| {
			type: "TOGGLE_TOOLTIP";
			word: PositionedWord;
			clickPosition: { x: number; y: number };
	  }
	| { type: "HIDE_TOOLTIP" }
	| { type: "RESIZE"; dimensions: { width: number; height: number } }
	| { type: "RETRY" };

// ============================================================================
// Pure Event Matching Functions (Following CLAUDE.md Effect patterns)
// ============================================================================

// Named conditions using Effect's Match for type-safe event handling
const matchDimensionEvent = (event: WordCloudEvent) =>
	Match.value(event).pipe(
		Match.when({ type: "LOAD_WORDS" }, (e) => Option.some(e.dimensions)),
		Match.when({ type: "RESIZE" }, (e) => Option.some(e.dimensions)),
		Match.orElse(() => Option.none()),
	);

const matchWordsLoadedEvent = (event: WordCloudEvent) =>
	Match.value(event).pipe(
		Match.when({ type: "WORDS_LOADED" }, (e) => Option.some(e.words)),
		Match.orElse(() => Option.none()),
	);

const matchErrorEvent = (event: WordCloudEvent) =>
	Match.value(event).pipe(
		Match.when({ type: "WORDS_FAILED" }, (e) => Option.some(e.error)),
		Match.orElse(() => Option.none()),
	);

const matchTooltipEvent = (event: WordCloudEvent) =>
	Match.value(event).pipe(
		Match.when({ type: "TOGGLE_TOOLTIP" }, (e) =>
			Option.some({ word: e.word, position: e.clickPosition }),
		),
		Match.orElse(() => Option.none()),
	);

// ============================================================================
// Machine Configuration
// ============================================================================

export const wordCloudMachine = createMachine(
	{
		id: "ubiquitousLanguageCloud",

		types: {} as {
			context: WordCloudContext;
			events: WordCloudEvent;
			input: { width: number; height: number };
		},

		initial: "loading",

		context: ({ input }) => ({
			words: [],
			rawWords: [],
			dimensions: { width: input.width, height: input.height },
			constraints: {
				width: input.width,
				height: input.height,
				padding: 20,
				existingWords: [],
			},
			tooltipData: null,
			error: null,
		}),

		states: {
			idle: {
				description: "Initial state before any word generation",
				on: {
					LOAD_WORDS: {
						target: "loading",
						actions: "updateDimensions",
					},
				},
			},

			loading: {
				description: "Generating word cloud layout using domain layer",
				entry: "generateWords",
				on: {
					WORDS_LOADED: {
						target: "ready",
						actions: "setWords",
					},
					WORDS_FAILED: {
						target: "error",
						actions: "setError",
					},
				},
			},

			ready: {
				description: "Word cloud is ready for interaction",
				on: {
					TOGGLE_TOOLTIP: {
						actions: "toggleTooltip",
						guard: "hasTooltipDefinition",
					},
					HIDE_TOOLTIP: {
						actions: "hideTooltip",
					},
					RESIZE: {
						target: "loading",
						actions: "updateDimensions",
					},
					LOAD_WORDS: {
						target: "loading",
						actions: "updateDimensions",
					},
				},
			},

			error: {
				description: "Error state with retry capability",
				on: {
					RETRY: {
						target: "loading",
						actions: "clearError",
					},
					LOAD_WORDS: {
						target: "loading",
						actions: ["updateDimensions", "clearError"],
					},
				},
			},
		},
	},
	{
		// ========================================================================
		// Actions (Pure Functions for State Updates)
		// ========================================================================

		actions: {
			updateDimensions: assign({
				dimensions: ({ event }) =>
					Option.getOrElse(matchDimensionEvent(event), () => DEFAULT_DIMENSIONS),
				constraints: ({ event }) => {
					const dimensions = Option.getOrElse(
						matchDimensionEvent(event),
						() => DEFAULT_DIMENSIONS,
					);
					return {
						width: dimensions.width,
						height: dimensions.height,
						padding: 20,
						existingWords: [],
					};
				},
			}),

			generateWords: ({ context, self }) => {
				// Use functional domain layer for word generation
				const rawWords = createDDDTermsSync();

				const constraints: LayoutConstraints = {
					width: context.dimensions.width,
					height: context.dimensions.height,
					padding: 20,
					existingWords: [],
				};

				// Keep within Effect context using functional composition
				const wordCloudEffect = pipe(
					createWordCloud(rawWords, constraints),
					Effect.match({
						onSuccess: (words) => {
							self.send({ type: "WORDS_LOADED", words });
						},
						onFailure: (error) => {
							const errorMessage =
								error._tag === "LayoutError"
									? error.message
									: "Word cloud generation failed";
							self.send({ type: "WORDS_FAILED", error: errorMessage });
						},
					}),
				);

				// Execute Effect without breaking context
				Effect.runSync(wordCloudEffect);
			},

			setWords: assign({
				words: ({ event }) =>
					Option.getOrElse(matchWordsLoadedEvent(event), () => []),
				error: () => null,
			}),

			toggleTooltip: assign({
				tooltipData: ({ event, context }) => {
					const tooltipInfo = matchTooltipEvent(event);
					return Option.match(tooltipInfo, {
						onSome: ({ word, position }) => {
							// Use Effect Match for tooltip logic
							return Match.value({ context, word }).pipe(
								Match.when(
									({ context, word }) =>
										context.tooltipData &&
										context.tooltipData.term === word.text,
									() => null, // Hide tooltip if clicking same word
								),
								Match.orElse(({ word }) => {
									// Show tooltip for new word
									const definition = getTermDefinitionSync(word.text);
									return definition
										? {
												term: word.text,
												definition,
												position,
											}
										: null;
								}),
							);
						},
						onNone: () => null,
					});
				},
			}),

			hideTooltip: assign({
				tooltipData: () => null,
			}),

			setError: assign({
				error: ({ event }) =>
					Option.getOrElse(
						matchErrorEvent(event),
						() => "Unknown error occurred",
					),
				words: () => [],
			}),

			clearError: assign({
				error: () => null,
			}),
		},

		// ========================================================================
		// Guards (Pure Predicate Functions)
		// ========================================================================

		guards: {
			hasTooltipDefinition: ({ event }) =>
				Option.match(matchTooltipEvent(event), {
					onSome: ({ word }) => getTermDefinitionSync(word.text) !== null,
					onNone: () => false,
				}),

			hasValidDimensions: ({ context }) => {
				const { width, height } = context.dimensions;
				return (
					width > 0 &&
					height > 0 &&
					Number.isFinite(width) &&
					Number.isFinite(height)
				);
			},

			isWithinBounds: ({ event }) =>
				Option.match(matchTooltipEvent(event), {
					onSome: ({ position }) =>
						position.x >= 0 &&
						position.y >= 0 &&
						Number.isFinite(position.x) &&
						Number.isFinite(position.y),
					onNone: () => true,
				}),
		},
	},
);

// ============================================================================
// Machine Type Exports (for TypeScript Integration)
// ============================================================================

export type WordCloudMachine = typeof wordCloudMachine;
export type WordCloudActor = ActorRefFrom<typeof wordCloudMachine>;
export type WordCloudSnapshot = ReturnType<WordCloudActor["getSnapshot"]>;

// ============================================================================
// ViewState Discriminated Union (No Boolean Blindness)
// ============================================================================

export type ViewState =
	| { readonly type: "Loading" }
	| {
			readonly type: "Ready";
			readonly words: readonly PositionedWord[];
			readonly tooltipData: WordCloudContext["tooltipData"];
	  }
	| { readonly type: "Error"; readonly error: string };

// ============================================================================
// Functional State Query (Replaces Boolean Blindness)
// ============================================================================

export const getViewState = (snapshot: WordCloudSnapshot): ViewState => {
	return Match.value(snapshot.value).pipe(
		Match.when("loading", (): ViewState => ({ type: "Loading" })),
		Match.when(
			"ready",
			(): ViewState => ({
				type: "Ready",
				words: snapshot.context.words,
				tooltipData: snapshot.context.tooltipData,
			}),
		),
		Match.when(
			"error",
			(): ViewState => ({
				type: "Error",
				error: snapshot.context.error || "Unknown error occurred",
			}),
		),
		Match.orElse((): ViewState => ({ type: "Loading" })),
	);
};

// ============================================================================
// Functional Utility Functions (Extract data from ViewState)
// ============================================================================

export const getWordsFromViewState = (
	viewState: ViewState,
): readonly PositionedWord[] => {
	return Match.value(viewState).pipe(
		Match.when({ type: "Ready" }, ({ words }) => words),
		Match.orElse(() => []),
	);
};

export const getTooltipFromViewState = (viewState: ViewState) => {
	return Match.value(viewState).pipe(
		Match.when({ type: "Ready" }, ({ tooltipData }) => tooltipData),
		Match.orElse(() => null),
	);
};

export const getErrorFromViewState = (viewState: ViewState): string | null => {
	return Match.value(viewState).pipe(
		Match.when({ type: "Error" }, ({ error }) => error),
		Match.orElse(() => null),
	);
};

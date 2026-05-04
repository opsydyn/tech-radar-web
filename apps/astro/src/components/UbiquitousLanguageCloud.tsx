import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { useMachine } from "@xstate/react";
import { Match } from "effect";
import type React from "react";
import { useCallback, useRef, useMemo } from "react";
import * as styles from "./UbiquitousLanguageCloud.css";
import { CATEGORY_COLORS } from "./UbiquitousLanguageCloud.data";
import type { PositionedWord } from "./UbiquitousLanguageCloud.domain";
import {
	getViewState,
	wordCloudMachine,
} from "./UbiquitousLanguageCloud.machine";
import {
	createCompleteWordStyle,
	createFontTier,
	createFontWeight,
	createMousePosition,
	createStaticTooltipPosition,
	createTooltipStyle,
} from "./UbiquitousLanguageCloud.styling";

// Domain types are now imported from .domain module
// This follows CLAUDE.md imperative shell/functional core separation

// ============================================================================
// Domain Types (Following CLAUDE.md Domain-Driven Design)
// ============================================================================

type ComponentDimensions = {
	readonly width: number;
	readonly height: number;
};

type UbiquitousLanguageCloudProps = {
	width?: number;
	height?: number;
};

// Domain constants for default dimensions
const DEFAULT_DIMENSIONS = {
	width: 900,
	height: 600,
} as const;

// ============================================================================
// Smart Constructor for Props Validation (Domain-Driven)
// ============================================================================

const createComponentDimensions = (width = DEFAULT_DIMENSIONS.width, height = DEFAULT_DIMENSIONS.height): ComponentDimensions => {
	return Match.value({ width, height }).pipe(
		Match.when(
			({ width, height }) => width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height),
			(dims) => dims
		),
		Match.orElse(() => DEFAULT_DIMENSIONS) // Safe defaults from domain constants
	);
};

const UbiquitousLanguageCloud: React.FC<UbiquitousLanguageCloudProps> = ({
	width = DEFAULT_DIMENSIONS.width,
	height = DEFAULT_DIMENSIONS.height,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);

	// Validate props using smart constructor (domain-driven validation) - memoized
	const dimensions = useMemo(() => createComponentDimensions(width, height), [width, height]);

	// XState machine for state management with validated dimensions
	const [snapshot, send] = useMachine(wordCloudMachine, {
		input: dimensions,
	});

	// Handle dimension changes functionally using Effect Match with validated dimensions
	const currentDimensions = snapshot.context.dimensions;
	Match.value({
		current: currentDimensions,
		target: dimensions,
	}).pipe(
		Match.when(
			({ current, target }) =>
				current.width !== target.width || current.height !== target.height,
			({ target }) => {
				send({ type: "RESIZE", dimensions: target });
				return true;
			},
		),
		Match.orElse(() => false),
	);

	// Extract state using functional ViewState discriminated union - memoized
	const viewState = useMemo(() => getViewState(snapshot), [snapshot]);

	// ============================================================================
	// Composable Event Handler Functions (Pure Functions)
	// ============================================================================

	const createTooltipToggleEvent = useCallback(
		(event: React.MouseEvent<SVGTextElement>, word: PositionedWord) => {
			const containerRect = containerRef.current?.getBoundingClientRect() ?? null;
			const basePosition = createMousePosition(event, containerRect);
			const staticPosition = createStaticTooltipPosition(basePosition, dimensions);

			return {
				type: "TOGGLE_TOOLTIP" as const,
				word,
				clickPosition: staticPosition,
			};
		},
		[dimensions],
	);

	const createTooltipDismissCondition = useCallback(
		(event: React.MouseEvent, target: EventTarget | null) => ({
			hasTooltip: viewState.type === "Ready" && viewState.tooltipData !== null,
			isValidTarget: event.target === target,
		}),
		[viewState],
	);

	// Simple click handler for tooltips (KISS principle) - now composable
	const handleWordClick = useCallback(
		(event: React.MouseEvent<SVGTextElement>, word: PositionedWord) => {
			event.stopPropagation(); // Prevent event from bubbling to container
			const toggleEvent = createTooltipToggleEvent(event, word);
			send(toggleEvent);
		},
		[send, createTooltipToggleEvent],
	);

	// Handle click-away to dismiss tooltip using composable functions
	const handleContainerClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			const condition = createTooltipDismissCondition(event, event.currentTarget);
			if (condition.hasTooltip && condition.isValidTarget) {
				send({ type: "HIDE_TOOLTIP" });
			}
		},
		[send, createTooltipDismissCondition],
	);

	// Handle SVG background click to dismiss tooltip using composable functions
	const handleSvgClick = useCallback(
		(event: React.MouseEvent<SVGSVGElement>) => {
			const condition = createTooltipDismissCondition(event, event.currentTarget);
			if (condition.hasTooltip && condition.isValidTarget) {
				send({ type: "HIDE_TOOLTIP" });
			}
		},
		[send, createTooltipDismissCondition],
	);

	// Composable keyboard event condition
	const createKeyboardDismissCondition = useCallback(
		(key: string) => ({
			isEscapeKey: key === "Escape",
			hasTooltip: viewState.type === "Ready" && viewState.tooltipData !== null,
		}),
		[viewState],
	);

	// Handle keyboard events for accessibility using composable functions
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			const condition = createKeyboardDismissCondition(event.key);
			if (condition.isEscapeKey && condition.hasTooltip) {
				send({ type: "HIDE_TOOLTIP" });
			}
		},
		[send, createKeyboardDismissCondition],
	);

	// Handle keyboard events for SVG using composable functions
	const handleSvgKeyDown = useCallback(
		(event: React.KeyboardEvent<SVGSVGElement>) => {
			const condition = createKeyboardDismissCondition(event.key);
			if (condition.isEscapeKey && condition.hasTooltip) {
				send({ type: "HIDE_TOOLTIP" });
			}
		},
		[send, createKeyboardDismissCondition],
	);

	// Memoize expensive category color calculations
	const categoryEntries = useMemo(() => Object.entries(CATEGORY_COLORS), []);

	// Functional rendering using Effect Match patterns
	const renderView = () =>
		Match.value(viewState).pipe(
			Match.when({ type: "Loading" }, () => (
				<div ref={containerRef} className={styles.container}>
					<div className={styles.loading}>
						<div>Loading word cloud...</div>
					</div>
				</div>
			)),
			Match.when({ type: "Error" }, ({ error }) => (
				<div ref={containerRef} className={styles.container}>
					<div className={styles.error}>
						<div>Error: {error}</div>
						<button type="button" onClick={() => send({ type: "RETRY" })}>
							Retry
						</button>
					</div>
				</div>
			)),
			Match.when({ type: "Ready" }, ({ words, tooltipData }) => (
				<div
					ref={containerRef}
					className={styles.container}
					onClick={handleContainerClick}
					onKeyDown={handleKeyDown}
				>
					<div className={styles.legend}>
						<div className={styles.legendTitle}>Categories:</div>
						{categoryEntries.map(([category, color]) => (
							<div key={category} className={styles.legendItem}>
								<div
									className={styles.legendColor}
									style={{ backgroundColor: color }}
								/>
								<div className={styles.legendText}>{category}</div>
							</div>
						))}
					</div>

					<svg
						ref={svgRef}
						width={dimensions.width}
						height={dimensions.height}
						className={styles.wordCloud}
						role="img"
						aria-label="DDD Ubiquitous Language Cloud"
						onClick={handleSvgClick}
						onKeyDown={handleSvgKeyDown}
					>
						<Group top={0} left={0}>
							{words.map((word) => (
								<Text
									key={word.text}
									x={word.position.x}
									y={word.position.y}
									fontSize={word.dimensions.fontSize}
									fontWeight={createFontWeight(
										createFontTier(word.dimensions.fontSize),
									)}
									textAnchor="middle"
									verticalAnchor="middle"
									fill={CATEGORY_COLORS[word.category]}
									className={styles.word}
									style={createCompleteWordStyle(word.dimensions.fontSize)}
									onClick={(event) => handleWordClick(event, word)}
								>
									{word.text}
								</Text>
							))}
						</Group>
					</svg>

					{/* Tooltip with monospace font using XState data and smart constructors */}
					{tooltipData && (
						<TooltipWithBounds
							top={tooltipData.position.y}
							left={tooltipData.position.x}
							style={{
								...defaultStyles,
								...createTooltipStyle(),
							}}
						>
							<div className={styles.tooltip}>
								<div className={styles.tooltipHeader}>
									<div className={styles.tooltipTitle}>{tooltipData.term}</div>
									<div className={styles.tooltipCategory}>
										{tooltipData.definition.category}
									</div>
								</div>
								<div className={styles.tooltipDefinition}>
									{tooltipData.definition.definition}
								</div>
								{tooltipData.definition.examples &&
									tooltipData.definition.examples.length > 0 && (
										<div className={styles.tooltipExamples}>
											<div className={styles.tooltipExamplesTitle}>
												Examples:
											</div>
											<ul className={styles.tooltipExamplesList}>
												{tooltipData.definition.examples.map((example) => (
													<li key={example}>{example}</li>
												))}
											</ul>
										</div>
									)}
							</div>
						</TooltipWithBounds>
					)}
				</div>
			)),
			Match.exhaustive,
		);

	return renderView();
};

export default UbiquitousLanguageCloud;

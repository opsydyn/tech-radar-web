import { useStore } from "@nanostores/react";
import { CornerUpRight } from "pixelarticons/react/CornerUpRight";
import { Search } from "pixelarticons/react/Search";
import {
	type ChangeEvent,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useDeferredValue,
	useMemo,
	useState,
} from "react";
import {
	getBlipSearchSuggestions,
	getHighlightedSnippet,
} from "~hooks/useBlipSearch";
import { getBlipPath } from "~utils/blipRouting";
import { getEditionIdentity } from "~utils/editionHelpers";
import * as styles from "./RadarTopNavControls.css";
import { selectedEdition } from "./editionSelectionState";
import {
	clearRadarSearchTerm,
	radarSearchableBlips,
	radarSearchTerm,
	requestRadarBlipFocus,
	requestRadarFirstMatchFocus,
	setRadarSearchTerm,
} from "./radarSearchStore";

const renderHighlightedText = (
	text: string,
	highlightRanges: readonly (readonly [number, number])[],
): ReactNode => {
	if (highlightRanges.length === 0) {
		return text;
	}

	const sortedRanges = [...highlightRanges].sort(
		([startA], [startB]) => startA - startB,
	);
	const nodes: ReactNode[] = [];
	let currentIndex = 0;

	for (const [start, end] of sortedRanges) {
		if (start > currentIndex) {
			nodes.push(text.slice(currentIndex, start));
		}

		nodes.push(
			<mark
				key={`${text}-${start}-${end}`}
				className={styles.suggestionHighlight}
			>
				{text.slice(start, end + 1)}
			</mark>,
		);

		currentIndex = end + 1;
	}

	if (currentIndex < text.length) {
		nodes.push(text.slice(currentIndex));
	}

	return nodes;
};

export const RadarTopNavControls = () => {
	const currentEdition = useStore(selectedEdition);
	const searchableBlips = useStore(radarSearchableBlips);
	const searchTerm = useStore(radarSearchTerm);
	const hasSearchTerm = searchTerm.trim().length > 0;
	const deferredSearchTerm = useDeferredValue(searchTerm);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const suggestions = useMemo(
		() => getBlipSearchSuggestions(searchableBlips, deferredSearchTerm),
		[deferredSearchTerm, searchableBlips],
	);
	const shouldShowSuggestions = isSearchFocused && hasSearchTerm;
	const showEmptyState = shouldShowSuggestions && suggestions.length === 0;
	const showSuggestions = shouldShowSuggestions && suggestions.length > 0;
	const currentEditionId = currentEdition
		? getEditionIdentity(currentEdition)
		: undefined;

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setActiveSuggestionIndex(-1);
			setRadarSearchTerm(event.target.value);
		},
		[],
	);

	const focusFirstMatchingBlip = useCallback(() => {
		setActiveSuggestionIndex(-1);
		setIsSearchFocused(false);
		requestRadarFirstMatchFocus();
	}, []);

	const selectSuggestion = useCallback((name: string, blipId?: string) => {
		setRadarSearchTerm(name);
		setActiveSuggestionIndex(-1);
		setIsSearchFocused(false);

		if (blipId) {
			requestRadarBlipFocus(blipId);
			return;
		}

		requestRadarFirstMatchFocus();
	}, []);

	const handleSearchKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter" && hasSearchTerm) {
				event.preventDefault();

				if (shouldShowSuggestions && activeSuggestionIndex >= 0) {
					const activeSuggestion = suggestions[activeSuggestionIndex]?.item;
					selectSuggestion(
						activeSuggestion?.name ?? searchTerm,
						activeSuggestion?.id,
					);
					return;
				}

				if (shouldShowSuggestions && suggestions[0]?.item.id) {
					requestRadarBlipFocus(suggestions[0].item.id);
					setActiveSuggestionIndex(-1);
					setIsSearchFocused(false);
					return;
				}

				focusFirstMatchingBlip();
				return;
			}

			if (!shouldShowSuggestions) {
				if (event.key === "Escape") {
					setActiveSuggestionIndex(-1);
					setIsSearchFocused(false);
				}

				return;
			}

			if (event.key === "ArrowDown") {
				event.preventDefault();
				setActiveSuggestionIndex((currentIndex) =>
					currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
				);
				return;
			}

			if (event.key === "ArrowUp") {
				event.preventDefault();
				setActiveSuggestionIndex((currentIndex) =>
					currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
				);
				return;
			}

			if (event.key === "Escape") {
				event.preventDefault();
				setActiveSuggestionIndex(-1);
				setIsSearchFocused(false);
			}
		},
		[
			activeSuggestionIndex,
			focusFirstMatchingBlip,
			hasSearchTerm,
			searchTerm,
			selectSuggestion,
			shouldShowSuggestions,
			suggestions,
		],
	);

	const handleClear = useCallback(() => {
		setActiveSuggestionIndex(-1);
		clearRadarSearchTerm();
	}, []);

	return (
		<div className={styles.controls}>
			<div className={styles.searchShell}>
				<label className={styles.searchField}>
					<Search className={styles.searchIcon} aria-hidden="true" />
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Search blips..."
						value={searchTerm}
						onBlur={() => {
							window.setTimeout(() => {
								setIsSearchFocused(false);
							}, 120);
						}}
						onChange={handleSearchChange}
						onFocus={() => setIsSearchFocused(true)}
						onKeyDown={handleSearchKeyDown}
						role="combobox"
						aria-autocomplete="list"
						aria-describedby="radar-search-enter-hint"
						aria-expanded={showSuggestions || showEmptyState}
						aria-haspopup="listbox"
						aria-label="Search radar blips"
						aria-controls="radar-search-suggestions"
						aria-activedescendant={
							activeSuggestionIndex >= 0
								? `radar-search-suggestion-${suggestions[activeSuggestionIndex]?.item.id}`
								: undefined
						}
					/>
					<span id="radar-search-enter-hint" className={styles.searchHint}>
						<kbd className={styles.searchHintKey}>Enter</kbd>{" "}
						<span className={styles.searchHintText}>to fly</span>
					</span>
					{hasSearchTerm && (
						<button
							type="button"
							className={styles.clearButton}
							onClick={handleClear}
						>
							Clear
						</button>
					)}
				</label>
				{showSuggestions && (
					<div
						id="radar-search-suggestions"
						className={styles.suggestionsPanel}
						role="listbox"
					>
						{suggestions.map((suggestion, index) => {
							const { highlights, item } = suggestion;
							const blipPath = getBlipPath(
								item,
								currentEditionId ? { editionId: currentEditionId } : undefined,
							);
							const descriptionSnippet = getHighlightedSnippet(
								item.description,
								highlights.description,
							);
							const showDescriptionSnippet =
								descriptionSnippet !== null && highlights.name.length === 0;

							return (
								<div
									key={item.id}
									id={`radar-search-suggestion-${item.id}`}
									role="option"
									className={styles.suggestionItem}
									data-active={
										index === activeSuggestionIndex ? "true" : undefined
									}
									tabIndex={-1}
									aria-selected={index === activeSuggestionIndex}
									onMouseEnter={() => setActiveSuggestionIndex(index)}
								>
									<button
										type="button"
										className={styles.suggestionAction}
										onMouseDown={(event) => {
											event.preventDefault();
										}}
										onClick={() => selectSuggestion(item.name, item.id)}
									>
										<span className={styles.suggestionTitle}>
											{renderHighlightedText(item.name, highlights.name)}
										</span>
										<span className={styles.suggestionMeta}>
											{renderHighlightedText(
												item.quadrant,
												highlights.quadrant,
											)}
											<span className={styles.suggestionDot}> · </span>
											{renderHighlightedText(item.ring, highlights.ring)}
										</span>
										{showDescriptionSnippet && descriptionSnippet ? (
											<span className={styles.suggestionDescription}>
												{renderHighlightedText(
													descriptionSnippet.text,
													descriptionSnippet.highlightRanges,
												)}
											</span>
										) : null}
									</button>
									<a
										href={blipPath}
										className={styles.suggestionLink}
										aria-label={`Open ${item.name} blip page`}
										title={`Open ${item.name}`}
										onClick={(event) => {
											event.stopPropagation();
										}}
									>
										<span className={styles.suggestionLinkText}>Open</span>
										<CornerUpRight
											className={styles.suggestionLinkIcon}
											aria-hidden="true"
										/>
									</a>
								</div>
							);
						})}
					</div>
				)}
				{showEmptyState && (
					<div
						id="radar-search-suggestions"
						className={styles.suggestionsPanel}
						role="status"
					>
						<div className={styles.emptyState}>No fuzzy matches yet</div>
					</div>
				)}
			</div>
		</div>
	);
};

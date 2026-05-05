import Fuse, { type FuseResultMatch } from "fuse.js";
import type { ChangeEvent } from "react";
import { useDeferredValue, useMemo, useState } from "react";
import type { Blip } from "~types/radar-types";

type HighlightRange = readonly [number, number];
type SuggestionHighlightKey = "description" | "name" | "quadrant" | "ring";

export type HighlightSnippet = {
	readonly text: string;
	readonly highlightRanges: readonly HighlightRange[];
};

export type BlipSearchSuggestion = {
	readonly item: Blip;
	readonly highlights: Readonly<
		Record<SuggestionHighlightKey, readonly HighlightRange[]>
	>;
};

// Options for Fuse.js search
export const fuseOptions = {
	keys: ["name", "description", "ring", "quadrant"],
	includeMatches: true,
	threshold: 0.3,
	includeScore: true,
};

const normalizeSearchTerm = (searchTerm: string) => searchTerm.trim();

const emptyHighlights: Readonly<
	Record<SuggestionHighlightKey, readonly HighlightRange[]>
> = {
	description: [],
	name: [],
	quadrant: [],
	ring: [],
};

const toHighlightKey = (
	key: FuseResultMatch["key"],
): SuggestionHighlightKey | null => {
	if (
		key === "description" ||
		key === "name" ||
		key === "quadrant" ||
		key === "ring"
	) {
		return key;
	}

	return null;
};

const getSuggestionHighlights = (
	matches: readonly FuseResultMatch[] | undefined,
): Readonly<Record<SuggestionHighlightKey, readonly HighlightRange[]>> => {
	if (!matches) {
		return emptyHighlights;
	}

	const highlights: Record<SuggestionHighlightKey, readonly HighlightRange[]> =
		{
			...emptyHighlights,
		};

	for (const match of matches) {
		const highlightKey = toHighlightKey(match.key);

		if (!highlightKey) {
			continue;
		}

		highlights[highlightKey] = match.indices;
	}

	return highlights;
};

export const getHighlightedSnippet = (
	text: string,
	highlightRanges: readonly HighlightRange[],
	contextCharacters = 18,
): HighlightSnippet | null => {
	if (highlightRanges.length === 0) {
		return null;
	}

	const sortedRanges = [...highlightRanges].sort(
		([startA], [startB]) => startA - startB,
	);
	const [firstRangeStart, firstRangeEnd] = sortedRanges[0];
	const snippetStart = Math.max(0, firstRangeStart - contextCharacters);
	const snippetEnd = Math.min(
		text.length,
		firstRangeEnd + contextCharacters + 1,
	);
	const rawSnippet = text.slice(snippetStart, snippetEnd);
	const leadingTrimmedCharacters =
		rawSnippet.length - rawSnippet.trimStart().length;
	const trailingTrimmedCharacters =
		rawSnippet.length - rawSnippet.trimEnd().length;
	const trimmedSnippet = rawSnippet.trim();

	if (!trimmedSnippet) {
		return null;
	}

	const trimmedSnippetStart = snippetStart + leadingTrimmedCharacters;
	const trimmedSnippetEnd = snippetEnd - trailingTrimmedCharacters;
	const hasLeadingEllipsis = trimmedSnippetStart > 0;
	const hasTrailingEllipsis = trimmedSnippetEnd < text.length;
	const prefix = hasLeadingEllipsis ? "…" : "";
	const suffix = hasTrailingEllipsis ? "…" : "";
	const adjustedHighlightRanges = sortedRanges
		.filter(
			([rangeStart, rangeEnd]) =>
				rangeEnd >= trimmedSnippetStart && rangeStart < trimmedSnippetEnd,
		)
		.map(([rangeStart, rangeEnd]) => {
			const boundedRangeStart = Math.max(rangeStart, trimmedSnippetStart);
			const boundedRangeEnd = Math.min(rangeEnd, trimmedSnippetEnd - 1);

			return [
				prefix.length + boundedRangeStart - trimmedSnippetStart,
				prefix.length + boundedRangeEnd - trimmedSnippetStart,
			] as const;
		});

	return {
		highlightRanges: adjustedHighlightRanges,
		text: `${prefix}${trimmedSnippet}${suffix}`,
	};
};

export const getBlipSearchSuggestions = (
	blips: readonly Blip[],
	searchTerm: string,
	limit = 6,
) => {
	const normalizedSearchTerm = normalizeSearchTerm(searchTerm);

	if (!normalizedSearchTerm) {
		return [];
	}

	return new Fuse([...blips], fuseOptions)
		.search(normalizedSearchTerm)
		.slice(0, limit)
		.map(({ item, matches }) => ({
			highlights: getSuggestionHighlights(matches),
			item,
		}));
};

export const useBlipSearchResults = (blips: Blip[], searchTerm: string) => {
	const deferredSearchTerm = useDeferredValue(searchTerm);

	const fuse = useMemo(() => new Fuse(blips, fuseOptions), [blips]);

	const filteredBlips = useMemo(() => {
		const normalizedSearchTerm = normalizeSearchTerm(deferredSearchTerm);

		if (!normalizedSearchTerm) {
			return blips;
		}

		const results = fuse.search(normalizedSearchTerm);
		return results.map((result) => result.item);
	}, [fuse, deferredSearchTerm, blips]);

	return {
		filteredBlips,
		resultsCount: filteredBlips.length,
		hasSearchTerm: normalizeSearchTerm(searchTerm).length > 0,
	};
};

/**
 * Custom hook for searching blips using Fuse.js
 * @param blips Array of blips to search through
 * @returns Search state and functions
 */
export const useBlipSearch = (blips: Blip[]) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { filteredBlips, resultsCount, hasSearchTerm } = useBlipSearchResults(
		blips,
		searchTerm,
	);

	// Handle search input change
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Clear search
	const clearSearch = () => {
		setSearchTerm("");
	};

	return {
		searchTerm,
		setSearchTerm,
		filteredBlips,
		handleSearchChange,
		clearSearch,
		resultsCount,
		hasSearchTerm,
	};
};

import { differenceInDays, differenceInMonths, startOfDay } from "date-fns";
import { Match } from "effect";
import { type DateValue, toValidDate } from "./dateFormatter";

export type DocumentFreshnessLevel =
	| "fresh"
	| "aging"
	| "stale"
	| "critical"
	| "invalid";

export type DocumentFreshness = {
	level: DocumentFreshnessLevel;
	daysOld: number;
	monthsOld: number;
	message: string;
	recommendation: string;
	actionable: boolean;
};

// Lookup table for freshness thresholds
const FRESHNESS_THRESHOLDS = {
	fresh: { max: 30, unit: "days" },
	aging: { max: 90, unit: "days" },
	stale: { max: 180, unit: "days" },
	critical: { max: Number.POSITIVE_INFINITY, unit: "days" },
} as const;

// Lookup table for freshness configurations
const FRESHNESS_CONFIG: Record<
	DocumentFreshnessLevel,
	{
		recommendation: string;
		actionable: boolean;
		messageTemplate: (value: number, unit: string) => string;
	}
> = {
	fresh: {
		recommendation: "Document is current",
		actionable: false,
		messageTemplate: (days) =>
			days === 0 ? "Updated today" : `Updated ${days} days ago`,
	},
	aging: {
		recommendation: "Consider reviewing soon",
		actionable: true,
		messageTemplate: (weeks) => `Updated ${weeks} weeks ago`,
	},
	stale: {
		recommendation: "Review recommended",
		actionable: true,
		messageTemplate: (months) => `Updated ${months} months ago`,
	},
	critical: {
		recommendation: "Review urgently needed",
		actionable: true,
		messageTemplate: (months) => `Updated ${months} months ago`,
	},
	invalid: {
		recommendation: "Update document date",
		actionable: true,
		messageTemplate: () => "Invalid date",
	},
} as const;

const invalidDocumentFreshness = (): DocumentFreshness => ({
	level: "invalid",
	daysOld: 0,
	monthsOld: 0,
	message: generateMessage("invalid", 0, 0),
	recommendation: FRESHNESS_CONFIG.invalid.recommendation,
	actionable: FRESHNESS_CONFIG.invalid.actionable,
});

/**
 * Determine freshness level based on days old using exhaustive pattern matching
 */
const determineFreshnessLevel = (daysOld: number): DocumentFreshnessLevel =>
	Match.value(daysOld).pipe(
		Match.when(
			(days) => days <= FRESHNESS_THRESHOLDS.fresh.max,
			() => "fresh" as const,
		),
		Match.when(
			(days) => days <= FRESHNESS_THRESHOLDS.aging.max,
			() => "aging" as const,
		),
		Match.when(
			(days) => days <= FRESHNESS_THRESHOLDS.stale.max,
			() => "stale" as const,
		),
		Match.orElse(() => "critical" as const),
	);

/**
 * Generate message based on freshness level using exhaustive pattern matching
 */
const generateMessage = (
	level: DocumentFreshnessLevel,
	daysOld: number,
	monthsOld: number,
): string =>
	Match.value(level).pipe(
		Match.when("fresh", () =>
			FRESHNESS_CONFIG.fresh.messageTemplate(daysOld, "days"),
		),
		Match.when("aging", () =>
			FRESHNESS_CONFIG.aging.messageTemplate(Math.floor(daysOld / 7), "weeks"),
		),
		Match.when("stale", () =>
			FRESHNESS_CONFIG.stale.messageTemplate(monthsOld, "months"),
		),
		Match.when("critical", () =>
			FRESHNESS_CONFIG.critical.messageTemplate(monthsOld, "months"),
		),
		Match.when("invalid", () =>
			FRESHNESS_CONFIG.invalid.messageTemplate(0, ""),
		),
		Match.exhaustive,
	);

/**
 * Calculate document freshness with exhaustive pattern matching
 */
export const calculateDocumentFreshness = (
	dateValue: DateValue,
): DocumentFreshness => {
	const parsedDate = toValidDate(dateValue);

	return Match.value(parsedDate).pipe(
		Match.when(null, invalidDocumentFreshness),
		Match.orElse((validDate) => {
			const now = startOfDay(new Date());
			const documentDate = startOfDay(validDate);
			const daysOld = differenceInDays(now, documentDate);
			const monthsOld = differenceInMonths(now, documentDate);
			const level = determineFreshnessLevel(daysOld);

			return {
				level,
				daysOld,
				monthsOld,
				message: generateMessage(level, daysOld, monthsOld),
				recommendation: FRESHNESS_CONFIG[level].recommendation,
				actionable: FRESHNESS_CONFIG[level].actionable,
			};
		}),
	);
};

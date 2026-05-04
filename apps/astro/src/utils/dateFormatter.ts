import { DateTime, Option, Schema, pipe } from "effect";

export const DateValueSchema = Schema.UndefinedOr(
	Schema.Union([Schema.String, Schema.DateValid]),
);

export type DateValue = typeof DateValueSchema.Type;

const decodeDateValue = Schema.decodeUnknownOption(DateValueSchema);

const toDateSource = (dateValue: DateValue) =>
	pipe(
		decodeDateValue(dateValue),
		Option.flatMap((value) => Option.fromUndefinedOr(value)),
		Option.map((value) =>
			typeof value === "string" ? value : value.toISOString(),
		),
	);

const toDateTime = (dateValue: DateValue) =>
	pipe(toDateSource(dateValue), Option.flatMap(DateTime.make));

const formatBritishDate = (dt: DateTime.DateTime): string =>
	DateTime.formatLocal(dt, {
		year: "numeric",
		month: "long",
		day: "2-digit",
		locale: "en-GB",
	});

const formatShortUsDate = (dt: DateTime.DateTime): string =>
	DateTime.formatLocal(dt, {
		year: "numeric",
		month: "short",
		day: "numeric",
		locale: "en-US",
	});

/**
 * Normalizes a date value to a stable string representation.
 * Useful for React keys, tooltip payloads, or preserving the original date value in UI state.
 */
export function normalizeDateValue(
	dateValue: DateValue,
	fallback = "",
): string {
	return pipe(
		toDateSource(dateValue),
		Option.match({
			onNone: () => fallback,
			onSome: (value) => value,
		}),
	);
}

/**
 * Formats a date string into a consistent format using Effect's DateTime
 * @param dateValue - The date string or Date to format
 * @returns Formatted date string or default message if date is undefined
 */
export function formatDate(dateValue: DateValue): string {
	return pipe(
		toDateTime(dateValue),
		Option.match({
			onNone: () => "No date recorded",
			onSome: formatBritishDate,
		}),
	);
}

/**
 * Formats a date for compact UI surfaces like charts and small metadata labels.
 */
export function formatShortDate(dateValue: DateValue): string {
	return pipe(
		toDateTime(dateValue),
		Option.match({
			onNone: () => "No date recorded",
			onSome: formatShortUsDate,
		}),
	);
}

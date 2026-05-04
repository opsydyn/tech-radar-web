import { DateTime, Option, pipe } from "effect";

const formatBritishDate = (dt: DateTime.DateTime): string =>
	DateTime.formatLocal(dt, {
		year: "numeric",
		month: "long",
		day: "2-digit",
		locale: "en-GB",
	});

/**
 * Formats a date string into a consistent format using Effect's DateTime
 * @param dateValue - The date string or Date to format
 * @returns Formatted date string or default message if date is undefined
 */
export function formatDate(dateValue: string | Date | undefined): string {
	return pipe(
		Option.fromNullable(dateValue),
		Option.flatMap((value) =>
			DateTime.make(typeof value === "string" ? value : value.toISOString()),
		),
		Option.match({
			onNone: () => "No date recorded",
			onSome: formatBritishDate,
		}),
	);
}

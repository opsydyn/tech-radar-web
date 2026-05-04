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
 * @param dateString - The date string to format
 * @returns Formatted date string or default message if date is undefined
 */
export function formatDate(dateString: string | undefined): string {
	return pipe(
		Option.fromNullable(dateString),
		Option.flatMap(DateTime.make),
		Option.match({
			onNone: () => "No date recorded",
			onSome: formatBritishDate,
		}),
	);
}

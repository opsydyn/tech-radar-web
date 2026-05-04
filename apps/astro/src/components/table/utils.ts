import type { FilterFn } from "@tanstack/react-table";

import type { BlipKeys, Row } from "./types";

const or =
	<T>(...predicates: Array<(value: T) => boolean>): ((value: T) => boolean) =>
	(value: T): boolean =>
		predicates.some((predicate) => predicate(value));

const startsWithIgnoreCase = (target: string) => (value: string) =>
	value.toLowerCase().startsWith(target.toLowerCase());

const includesIgnoreCase = (target: string) => (value: string) =>
	value.toLowerCase().includes(target.toLowerCase());

function isBlipKey(key: any): key is BlipKeys {
	return [
		"id",
		"name",
		"quadrant",
		"ring",
		"description",
		"hasAdr",
		"tags",
	].includes(key);
}

export const typeaheadFilter: FilterFn<Row> = (row, columnId, filterValue) => {
	if (!filterValue) return true;
	if (!isBlipKey(columnId)) return false;
	// @ts-ignore: suppressing index type error
	const rowValue = row.original[columnId];

	if (typeof rowValue !== "string") return false;

	const matchesFilter = or(
		startsWithIgnoreCase(filterValue),
		includesIgnoreCase(filterValue),
	);

	return matchesFilter(rowValue);
};

// export const getMatches = (
//   input: Array<string>,
//   toMatch: Array<string>
// ): Array<string> => {
//   return input.filter((item) => toMatch.includes(item));
// };

export const getMatches =
	(toMatch: Array<string>) =>
	(input: Array<string>): Array<string> =>
		input.filter((item) =>
			toMatch.some(
				(matchItem) => matchItem.toLowerCase() === item.toLowerCase(),
			),
		);

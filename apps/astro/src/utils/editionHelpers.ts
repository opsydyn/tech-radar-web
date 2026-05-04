/**
 * Edition Helpers - Functional utilities for edition-based filtering
 *
 * Domain Logic:
 * - A blip appears in an edition if it has move history on or before that edition's date
 * - Editions represent snapshots in time
 * - Blips can appear in multiple editions if they have multiple moves
 */

import type { Blip } from "~/types/radar-types";

// 🏷️ Branded types for domain safety
type EditionNumber = number & { readonly __brand: 'EditionNumber' };
type EditionDate = Date & { readonly __brand: 'EditionDate' };

export type Edition = {
  number: EditionNumber;
  title: string;
  date: EditionDate;
};

// 🛡️ Smart constructor for Edition
type ValidationError = {
  type: 'ValidationError';
  field: string;
  message: string;
};

type Result<T, E> =
  | { isOk: true; value: T }
  | { isOk: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ isOk: true, value });
const err = <E>(error: E): Result<never, E> => ({ isOk: false, error });

export const createEdition = (
  number: number,
  title: string,
  date: Date
): Result<Edition, ValidationError> => {
  if (number < 1) {
    return err({
      type: 'ValidationError',
      field: 'number',
      message: 'Edition number must be positive'
    });
  }

  if (!title.trim()) {
    return err({
      type: 'ValidationError',
      field: 'title',
      message: 'Edition title cannot be empty'
    });
  }

  return ok({
    number: number as EditionNumber,
    title,
    date: date as EditionDate
  });
};

/**
 * Check if a blip was active at a given edition date
 *
 * A blip is "active" in an edition if:
 * 1. It has at least one move entry on or before the edition date
 * 2. The most recent move before the edition date wasn't a "go" (removed)
 */
export const isBlipActiveInEdition = (blip: Blip, editionDate: Date): boolean => {
  if (!blip.move || blip.move.length === 0) {
    // Blip with no move history - not active in any edition
    return false;
  }

  // Filter moves on or before edition date
  const relevantMoves = blip.move
    .filter(([_, moveDate]) => new Date(moveDate) <= editionDate)
    .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime()); // Sort by date descending

  if (relevantMoves.length === 0) {
    // No moves before this edition
    return false;
  }

  // Check most recent move
  const [mostRecentMove] = relevantMoves[0];

  // Blip is active unless most recent move is "go" (removed from radar)
  return mostRecentMove !== "go";
};

/**
 * Get all blips active in a specific edition
 */
export const getBlipsForEdition = (
  blips: Blip[],
  edition: Edition
): Blip[] => {
  return blips.filter(blip => isBlipActiveInEdition(blip, edition.date));
};

/**
 * Get move history entries that occurred in a specific edition
 *
 * Returns moves that happened on the edition date or within the edition's timeframe
 * (between previous edition and current edition)
 */
export const getMovesInEdition = (
  blip: Blip,
  edition: Edition,
  previousEditionDate?: Date
): Array<[string, string]> => {
  if (!blip.move) return [];

  const startDate = previousEditionDate ?? new Date(0); // Beginning of time if no previous edition
  const endDate = edition.date;

  return blip.move.filter(([_, moveDate]) => {
    const date = new Date(moveDate);
    return date > startDate && date <= endDate;
  });
};

/**
 * Determine if a blip is "new" in this edition
 * A blip is new if this edition contains its first move entry
 */
export const isBlipNewInEdition = (blip: Blip, edition: Edition): boolean => {
  if (!blip.move || blip.move.length === 0) return false;

  // Sort moves chronologically
  const sortedMoves = [...blip.move].sort(
    (a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime()
  );

  const firstMoveDate = new Date(sortedMoves[0][1]);

  // Check if first move is on or before edition date
  // and there's no previous edition containing this blip
  return firstMoveDate <= edition.date;
};

/**
 * Get all editions a blip appears in
 */
export const getEditionsForBlip = (
  blip: Blip,
  allEditions: Edition[]
): Edition[] => {
  return allEditions.filter(edition => isBlipActiveInEdition(blip, edition.date));
};

/**
 * Sort editions chronologically (most recent first)
 */
export const sortEditionsByDate = (editions: Edition[]): Edition[] => {
  return [...editions].sort((a, b) => b.date.getTime() - a.date.getTime());
};

/**
 * Get the most recent edition
 */
export const getLatestEdition = (editions: Edition[]): Edition | null => {
  const sorted = sortEditionsByDate(editions);
  return sorted[0] ?? null;
};

/**
 * Format edition for display
 */
export const formatEditionLabel = (edition: Edition): string => {
  return `Edition ${edition.number}: ${edition.title}`;
};

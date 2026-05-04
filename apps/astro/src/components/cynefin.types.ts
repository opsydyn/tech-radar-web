// Domain types for Cynefin Framework visualization
// Following F#-inspired domain modeling patterns

import { Either } from "effect";

// Use Effect's Either type for proper functional programming
export type Result<T, E> = Either.Either<T, E>;
export const ok = Either.right;
export const err = Either.left;

// 🏷️ Branded types for domain concepts
export type CynefinDomain =
	| "Clear"
	| "Complicated"
	| "Complex"
	| "Chaotic"
	| "Aporetic";

export type DomainPosition = {
	readonly x: number;
	readonly y: number;
} & { readonly __brand: "DomainPosition" };

export type DomainSize = {
	readonly width: number;
	readonly height: number;
} & { readonly __brand: "DomainSize" };

export type DomainColor = string & { readonly __brand: "DomainColor" };

// 🚨 Domain errors as discriminated unions
export type CynefinError =
	| { type: "ValidationError"; field: string; message: string }
	| { type: "CalculationError"; operation: string; message: string }
	| { type: "RenderError"; component: string; message: string };

// 💎 Value objects with proper validation
export type DomainCharacteristics = {
	readonly domain: CynefinDomain;
	readonly description: string;
	readonly approach: string;
	readonly position: DomainPosition;
	readonly size: DomainSize;
	readonly color: DomainColor;
};

export type CynefinLayout = {
	readonly domains: readonly DomainCharacteristics[];
	readonly width: number;
	readonly height: number;
};

// 🔍 Interaction state without boolean blindness
export type InteractionState =
	| { type: "Idle" }
	| { type: "Hovered"; domain: CynefinDomain }
	| { type: "Selected"; domain: CynefinDomain; approach: string }
	| { type: "Transitioning"; from: CynefinDomain; to: CynefinDomain };

// 🛡️ Smart constructors with validation
export const createCynefinDomain = (
	domain: string,
): Result<CynefinDomain, CynefinError> => {
	const validDomains: CynefinDomain[] = [
		"Clear",
		"Complicated",
		"Complex",
		"Chaotic",
		"Aporetic",
	];

	if (!validDomains.includes(domain as CynefinDomain)) {
		return err({
			type: "ValidationError",
			field: "domain",
			message: `Invalid Cynefin domain: ${domain}. Must be one of: ${validDomains.join(", ")}`,
		});
	}

	return ok(domain as CynefinDomain);
};

export const createDomainPosition = (
	x: number,
	y: number,
): Result<DomainPosition, CynefinError> => {
	if (x < 0 || y < 0) {
		return err({
			type: "ValidationError",
			field: "position",
			message: "Position coordinates must be non-negative",
		});
	}

	if (x > 1000 || y > 1000) {
		return err({
			type: "ValidationError",
			field: "position",
			message: "Position coordinates must be within reasonable bounds (0-1000)",
		});
	}

	return ok({ x, y } as DomainPosition);
};

export const createDomainSize = (
	width: number,
	height: number,
): Result<DomainSize, CynefinError> => {
	if (width <= 0 || height <= 0) {
		return err({
			type: "ValidationError",
			field: "size",
			message: "Size dimensions must be positive",
		});
	}

	if (width > 500 || height > 500) {
		return err({
			type: "ValidationError",
			field: "size",
			message: "Size dimensions must be within reasonable bounds (1-500)",
		});
	}

	return ok({ width, height } as DomainSize);
};

export const createDomainColor = (
	color: string,
): Result<DomainColor, CynefinError> => {
	// Basic hex color validation
	const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

	if (!hexColorRegex.test(color)) {
		return err({
			type: "ValidationError",
			field: "color",
			message: `Invalid color format: ${color}. Must be a valid hex color (e.g., #FF0000)`,
		});
	}

	return ok(color as DomainColor);
};

// 🔧 Smart constructor that composes other smart constructors
export const createDomainCharacteristics = (data: {
	domain: string;
	description: string;
	approach: string;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}): Result<DomainCharacteristics, CynefinError> => {
	const domainResult = createCynefinDomain(data.domain);
	const positionResult = createDomainPosition(data.x, data.y);
	const sizeResult = createDomainSize(data.width, data.height);
	const colorResult = createDomainColor(data.color);

	// Combine all validation results functionally using Effect
	if (Either.isLeft(domainResult)) return err(domainResult.left);
	if (Either.isLeft(positionResult)) return err(positionResult.left);
	if (Either.isLeft(sizeResult)) return err(sizeResult.left);
	if (Either.isLeft(colorResult)) return err(colorResult.left);

	return ok({
		domain: domainResult.right,
		description: data.description,
		approach: data.approach,
		position: positionResult.right,
		size: sizeResult.right,
		color: colorResult.right,
	});
};

// 📦 Lookup tables for domain-specific mappings (avoiding control flow)
export const DOMAIN_DESCRIPTIONS = {
	Clear: "Known knowns. Rules apply.",
	Complicated: "Known unknowns. Expert analysis needed.",
	Complex: "Unknown unknowns. Patterns emerge.",
	Chaotic: "No patterns. Act immediately.",
	Aporetic: "Not yet understood.",
} as const;

export const DOMAIN_APPROACHES = {
	Clear: "Sense → Categorize → Respond",
	Complicated: "Sense → Analyze → Respond",
	Complex: "Probe → Sense → Respond",
	Chaotic: "Act → Sense → Respond",
	Aporetic: "Pause, reframe, explore",
} as const;

export const DOMAIN_COLORS = {
	Clear: "#4CAF50", // Green - stable, known
	Complicated: "#2196F3", // Blue - analytical, expert
	Complex: "#FF9800", // Orange - emergent, experimental
	Chaotic: "#F44336", // Red - urgent, crisis
	Aporetic: "#9C27B0", // Purple - confusion, novel
} as const;

// 🔍 Type guards for runtime type checking
export const isCynefinDomain = (value: unknown): value is CynefinDomain => {
	return (
		typeof value === "string" &&
		["Clear", "Complicated", "Complex", "Chaotic", "Aporetic"].includes(value)
	);
};

export const isInteractionState = (
	value: unknown,
): value is InteractionState => {
	if (typeof value !== "object" || value === null) return false;

	const state = value as { type: string };
	return ["Idle", "Hovered", "Selected", "Transitioning"].includes(state.type);
};

// 🧮 Pure utility functions for domain calculations
export const getDomainDescription = (domain: CynefinDomain): string =>
	DOMAIN_DESCRIPTIONS[domain];

export const getDomainApproach = (domain: CynefinDomain): string =>
	DOMAIN_APPROACHES[domain];

export const getDomainColor = (domain: CynefinDomain): string =>
	DOMAIN_COLORS[domain];

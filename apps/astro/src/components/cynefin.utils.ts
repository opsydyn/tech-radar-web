// Pure transformation functions for Cynefin Framework visualization
// Following functional programming patterns from CLAUDE.md

import { Either } from "effect";
import {
	type CynefinDomain,
	type CynefinError,
	type CynefinLayout,
	DOMAIN_APPROACHES,
	DOMAIN_COLORS,
	DOMAIN_DESCRIPTIONS,
	type DomainCharacteristics,
	type DomainPosition,
	type DomainSize,
	type Result,
	createDomainCharacteristics,
	err,
	ok,
} from "./cynefin.types";

// 🎯 Configuration constants for layout calculations
const LAYOUT_CONFIG = {
	PADDING: 20,
	DOMAIN_SPACING: 10,
	MIN_DOMAIN_SIZE: 120,
	LABEL_HEIGHT: 40,
	BORDER_RADIUS: 8,
	STROKE_WIDTH: 2,
} as const;

// 📐 Pure functions for position calculations
export const calculateQuadrantPosition = (
	domain: CynefinDomain,
	width: number,
	height: number,
): Result<DomainPosition, CynefinError> => {
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const padding = LAYOUT_CONFIG.PADDING;
	const spacing = LAYOUT_CONFIG.DOMAIN_SPACING;

	// Quadrant positioning following traditional Cynefin layout
	const positions = {
		Clear: { x: padding, y: padding }, // Top-left: Simple/Obvious
		Complicated: { x: halfWidth + spacing, y: padding }, // Top-right: Complicated
		Complex: { x: padding, y: halfHeight + spacing }, // Bottom-left: Complex
		Chaotic: { x: halfWidth + spacing, y: halfHeight + spacing }, // Bottom-right: Chaotic
		Aporetic: { x: halfWidth - 60, y: halfHeight - 20 }, // Center: Disorder/Confusion
	};

	const position = positions[domain];
	if (!position) {
		return err({
			type: "CalculationError",
			operation: "calculateQuadrantPosition",
			message: `Unknown domain: ${domain}`,
		});
	}

	return ok({ x: position.x, y: position.y } as DomainPosition);
};

export const calculateDomainSize = (
	domain: CynefinDomain,
	width: number,
	height: number,
): Result<DomainSize, CynefinError> => {
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const padding = LAYOUT_CONFIG.PADDING;
	const spacing = LAYOUT_CONFIG.DOMAIN_SPACING;

	// Size calculations based on quadrant layout
	const sizes = {
		Clear: {
			width: halfWidth - padding - spacing,
			height: halfHeight - padding - spacing,
		},
		Complicated: {
			width: halfWidth - padding - spacing,
			height: halfHeight - padding - spacing,
		},
		Complex: {
			width: halfWidth - padding - spacing,
			height: halfHeight - padding - spacing,
		},
		Chaotic: {
			width: halfWidth - padding - spacing,
			height: halfHeight - padding - spacing,
		},
		Aporetic: {
			width: 120,
			height: 40,
		}, // Smaller center area
	};

	const size = sizes[domain];
	if (!size) {
		return err({
			type: "CalculationError",
			operation: "calculateDomainSize",
			message: `Unknown domain: ${domain}`,
		});
	}

	// Ensure minimum size constraints
	const finalWidth = Math.max(size.width, LAYOUT_CONFIG.MIN_DOMAIN_SIZE);
	const finalHeight = Math.max(size.height, LAYOUT_CONFIG.MIN_DOMAIN_SIZE);

	return ok({ width: finalWidth, height: finalHeight } as DomainSize);
};

// 🎨 Pure function for domain data transformation
export const transformDomainData = (
	domain: CynefinDomain,
	width: number,
	height: number,
): Result<DomainCharacteristics, CynefinError> => {
	const positionResult = calculateQuadrantPosition(domain, width, height);
	const sizeResult = calculateDomainSize(domain, width, height);

	if (Either.isLeft(positionResult)) return err(positionResult.left);
	if (Either.isLeft(sizeResult)) return err(sizeResult.left);

	return createDomainCharacteristics({
		domain,
		description: DOMAIN_DESCRIPTIONS[domain],
		approach: DOMAIN_APPROACHES[domain],
		x: positionResult.right.x,
		y: positionResult.right.y,
		width: sizeResult.right.width,
		height: sizeResult.right.height,
		color: DOMAIN_COLORS[domain],
	});
};

// 🏗️ Pure function for complete layout generation
export const generateCynefinLayout = (
	width: number,
	height: number,
): Result<CynefinLayout, CynefinError> => {
	const domains: CynefinDomain[] = [
		"Clear",
		"Complicated",
		"Complex",
		"Chaotic",
		"Aporetic",
	];
	const domainResults: DomainCharacteristics[] = [];

	// Transform each domain
	for (const domain of domains) {
		const result = transformDomainData(domain, width, height);
		if (Either.isLeft(result)) {
			return err(result.left);
		}
		domainResults.push(result.right);
	}

	return ok({
		domains: domainResults,
		width,
		height,
	});
};

// 📊 Pure functions for interaction calculations
export const calculateHoverPosition = (
	mouseX: number,
	mouseY: number,
	layout: CynefinLayout,
): CynefinDomain | null => {
	// Find which domain contains the mouse position
	for (const domainChar of layout.domains) {
		const { position, size } = domainChar;

		if (
			mouseX >= position.x &&
			mouseX <= position.x + size.width &&
			mouseY >= position.y &&
			mouseY <= position.y + size.height
		) {
			return domainChar.domain;
		}
	}

	return null;
};

export const calculateTransitionPath = (
	from: CynefinDomain,
	to: CynefinDomain,
	layout: CynefinLayout,
): Result<
	{ startX: number; startY: number; endX: number; endY: number },
	CynefinError
> => {
	const fromDomain = layout.domains.find((d) => d.domain === from);
	const toDomain = layout.domains.find((d) => d.domain === to);

	if (!fromDomain || !toDomain) {
		return err({
			type: "CalculationError",
			operation: "calculateTransitionPath",
			message: `Cannot find domain positions for transition from ${from} to ${to}`,
		});
	}

	// Calculate center points of each domain
	const startX = fromDomain.position.x + fromDomain.size.width / 2;
	const startY = fromDomain.position.y + fromDomain.size.height / 2;
	const endX = toDomain.position.x + toDomain.size.width / 2;
	const endY = toDomain.position.y + toDomain.size.height / 2;

	return ok({ startX, startY, endX, endY });
};

// 🎯 Pure functions for domain analysis
export const analyzeDomainComplexity = (domain: CynefinDomain): number => {
	// Complexity scoring based on Cynefin framework principles
	const complexityScores = {
		Clear: 1, // Known knowns - lowest complexity
		Complicated: 3, // Known unknowns - medium complexity
		Complex: 7, // Unknown unknowns - high complexity
		Chaotic: 9, // No patterns - highest complexity
		Aporetic: 5, // Confusion - medium complexity
	};

	return complexityScores[domain];
};

export const getRecommendedApproach = (domain: CynefinDomain): string => {
	return DOMAIN_APPROACHES[domain];
};

export const getDomainCharacteristics = (
	domain: CynefinDomain,
): {
	description: string;
	approach: string;
	complexity: number;
	color: string;
} => {
	return {
		description: DOMAIN_DESCRIPTIONS[domain],
		approach: DOMAIN_APPROACHES[domain],
		complexity: analyzeDomainComplexity(domain),
		color: DOMAIN_COLORS[domain],
	};
};

// 🔄 Pure functions for domain transitions
export const getValidTransitions = (from: CynefinDomain): CynefinDomain[] => {
	// Based on Cynefin framework, some transitions are more natural than others
	const transitionMap = {
		Clear: ["Complicated", "Aporetic"], // Can become complicated when assumptions fail
		Complicated: ["Clear", "Complex", "Aporetic"], // Can be simplified or become complex
		Complex: ["Complicated", "Chaotic", "Aporetic"], // Can stabilize or collapse
		Chaotic: ["Complex", "Aporetic"], // Can stabilize or remain confused
		Aporetic: ["Clear", "Complicated", "Complex", "Chaotic"], // Can move to any domain once understood
	};

	return transitionMap[from] as CynefinDomain[];
};

export const calculateTransitionProbability = (
	from: CynefinDomain,
	to: CynefinDomain,
): number => {
	const validTransitions = getValidTransitions(from);

	if (!validTransitions.includes(to)) {
		return 0; // Invalid transition
	}

	// Simple probability model based on common transition patterns
	const transitionProbabilities = {
		Clear: { Complicated: 0.3, Aporetic: 0.1 },
		Complicated: { Clear: 0.4, Complex: 0.2, Aporetic: 0.1 },
		Complex: { Complicated: 0.3, Chaotic: 0.2, Aporetic: 0.1 },
		Chaotic: { Complex: 0.5, Aporetic: 0.2 },
		Aporetic: { Clear: 0.2, Complicated: 0.3, Complex: 0.3, Chaotic: 0.2 },
	};

	return transitionProbabilities[from][to] || 0;
};

// 🎨 Pure functions for visual styling
export const getInteractionStyles = (
	domain: CynefinDomain,
	isHovered: boolean,
	isSelected: boolean,
): {
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	opacity: number;
} => {
	const baseColor = DOMAIN_COLORS[domain];

	if (isSelected) {
		return {
			fillColor: baseColor,
			strokeColor: "#333",
			strokeWidth: 3,
			opacity: 0.9,
		};
	}

	if (isHovered) {
		return {
			fillColor: baseColor,
			strokeColor: "#666",
			strokeWidth: 2,
			opacity: 0.8,
		};
	}

	return {
		fillColor: baseColor,
		strokeColor: "#999",
		strokeWidth: 1,
		opacity: 0.6,
	};
};

// 🧮 Utility functions for component integration
export const createDefaultLayout = (): Result<CynefinLayout, CynefinError> => {
	return generateCynefinLayout(800, 600);
};

export const validateLayoutDimensions = (
	width: number,
	height: number,
): Result<{ width: number; height: number }, CynefinError> => {
	if (width < 400 || height < 300) {
		return err({
			type: "ValidationError",
			field: "dimensions",
			message: "Layout dimensions must be at least 400x300 pixels",
		});
	}

	if (width > 2000 || height > 1500) {
		return err({
			type: "ValidationError",
			field: "dimensions",
			message: "Layout dimensions must not exceed 2000x1500 pixels",
		});
	}

	return ok({ width, height });
};

// 🎪 Export configuration for component usage
export const CYNEFIN_CONFIG = {
	DEFAULT_WIDTH: 800,
	DEFAULT_HEIGHT: 600,
	MIN_WIDTH: 400,
	MIN_HEIGHT: 300,
	MAX_WIDTH: 2000,
	MAX_HEIGHT: 1500,
	LAYOUT_CONFIG,
} as const;

import { useStore } from "@nanostores/react";
import { useCallback, useMemo } from "react";
import { GenWrapper } from "~components/Gen";
import { radarConfig } from "~stores/radar-store";
import type { Blip, BlipWithPosition } from "~types/radar-types";

type Position = { x: number; y: number };
type PolarCoordinate = { angle: number; radius: number };

const quadrants = {
	Tools: 1,
	Techniques: 2,
	Platforms: 3,
	"languages-frameworks": 4,
} as const;

const ringStatus = {
	Adopt: 1,
	Trial: 2,
	Assess: 3,
	Hold: 4,
} as const;

// Pure function to convert polar to cartesian coordinates
const polarToCartesian = (
	centerX: number,
	centerY: number,
	angle: number,
	radius: number,
): Position => ({
	x: centerX + radius * Math.cos(angle) - centerX,
	y: centerY + radius * Math.sin(angle) - centerY,
});

// Pure function to calculate distance between two positions
const getDistance = (pos1: Position, pos2: Position): number => {
	const dx = pos1.x - pos2.x;
	const dy = pos1.y - pos2.y;
	return Math.sqrt(dx * dx + dy * dy);
};

// Pure function to check if two blips are overlapping
const isOverlapping = (
	blip1: BlipWithPosition,
	blip2: BlipWithPosition,
	minDistance: number,
): boolean => getDistance(blip1.position, blip2.position) < minDistance;

// Pure function to get minimum distance based on ring
const getMinDistanceForRing = (ring: string, baseDistance: number): number =>
	ring === "Adopt" ? baseDistance * 1.2 : baseDistance;

// Pure function to convert cartesian to polar coordinates
const cartesianToPolar = (position: Position): PolarCoordinate => ({
	radius: Math.sqrt(position.x * position.x + position.y * position.y),
	angle: Math.atan2(position.y, position.x),
});

// Pure function to ensure angle stays within quadrant boundaries
const constrainAngleToQuadrant = (
	angle: number,
	quadrantIndex: number,
	flexMargin: number = 0.05,
): number => {
	const quadrantStartAngle = quadrantIndex * (Math.PI / 2);
	const quadrantEndAngle = (quadrantIndex + 1) * (Math.PI / 2);
	const minAllowedAngle = quadrantStartAngle - flexMargin;
	const maxAllowedAngle = quadrantEndAngle + flexMargin;

	if (angle < minAllowedAngle) return minAllowedAngle;
	if (angle > maxAllowedAngle) return maxAllowedAngle;

	return angle;
};

// Pure function to create a new position with adjusted angle and radius
const MIN_RADIUS = 10; // Minimum allowed radius
const createAdjustedPosition = (
	position: Position,
	centerX: number,
	centerY: number,
	angleAdjustment: number,
	radiusAdjustment: number,
	quadrantIndex: number,
): Position => {
	const { angle, radius } = cartesianToPolar(position);

	const newAngle = constrainAngleToQuadrant(
		angle + angleAdjustment,
		quadrantIndex,
	);

	const newRadius = Math.max(radius + radiusAdjustment, MIN_RADIUS); // Ensure positive radius

	return polarToCartesian(centerX, centerY, newAngle, newRadius);
};

// Pure function to find a non-overlapping position
const findNonOverlappingPosition = (
	blip: BlipWithPosition,
	placedBlips: readonly BlipWithPosition[],
	centerX: number,
	centerY: number,
	minDistance: number,
	maxIterations: number = 15,
): BlipWithPosition => {
	const quadrantIndex = quadrants[blip.quadrant] - 1;
	const ringSpecificDistance = getMinDistanceForRing(blip.ring, minDistance);

	// Define adjustment strategies as a lookup table
	const adjustmentStrategies = {
		angleOnly: (i: number): [number, number] => [0.1 + i * 0.2, 0],
		radiusOnly: (i: number): [number, number] => [0, 5 + i],
		combined: (i: number): [number, number] => [
			(0.1 + i * 0.02) * 0.7,
			(5 + i) * 0.7,
		],
	};

	// Pure function to get strategy key based on index
	const getStrategyKey = (index: number): keyof typeof adjustmentStrategies => {
		const keys = Object.keys(adjustmentStrategies) as Array<
			keyof typeof adjustmentStrategies
		>;
		return keys[index % keys.length];
	};

	// Generator function using functional approach
	function* createAdjustmentSequence(): Generator<[number, number]> {
		function* yieldAdjustments(index: number): Generator<[number, number]> {
			if (index >= maxIterations) return;

			const strategyKey = getStrategyKey(index);
			yield adjustmentStrategies[strategyKey](index);

			yield* yieldAdjustments(index + 1);
		}

		yield* yieldAdjustments(0);
	}

	// Function to check if a position has no overlaps
	const hasNoOverlaps = (testBlip: BlipWithPosition): boolean =>
		!placedBlips.some((placedBlip) =>
			isOverlapping(testBlip, placedBlip, ringSpecificDistance),
		);

	// If the original position has no overlaps, return it immediately
	if (hasNoOverlaps(blip)) {
		return blip;
	}

	// Use GenWrapper to process the adjustment sequence
	const adjustmentGen = GenWrapper(createAdjustmentSequence);
	const adjustments = adjustmentGen.take(maxIterations);

	// Try each adjustment in sequence until we find a non-overlapping position
	let currentBlip = blip;
	for (const [angleAdjustment, radiusAdjustment] of adjustments) {
		if (hasNoOverlaps(currentBlip)) {
			return currentBlip;
		}

		const newPosition = createAdjustedPosition(
			currentBlip.position,
			centerX,
			centerY,
			angleAdjustment,
			radiusAdjustment,
			quadrantIndex,
		);

		currentBlip = {
			...currentBlip,
			position: newPosition,
		};
	}

	return currentBlip;
};

// Get the radius range for a specific ring
const getRingRadiusRange = (
	ringName: keyof typeof ringStatus,
	totalRadius: number,
	maxRadius: number,
): { innerRadius: number; outerRadius: number } => {
	const ringIndex = ringStatus[ringName] - 1;
	const ringCount = Object.keys(ringStatus).length;
	const ringWidth = totalRadius / ringCount;

	// Calculate inner and outer radius for the ring
	const innerRadius = ringIndex * ringWidth;
	const outerRadius = Math.min((ringIndex + 1) * ringWidth, maxRadius);

	return { innerRadius, outerRadius };
};

// Hook to calculate blip positions with collision avoidance
const useBlipPositions = (blips: Blip[]) => {
	const { centerX, centerY, radius, maxRadius } = useStore(radarConfig);
	const MIN_BLIP_DISTANCE = 30;

	// Pure function to calculate initial polar coordinates for a blip
	const calculatePolarCoordinates = useCallback(
		(
			blip: Blip,
			blipsInQuadrantAndRing: number,
			blipIndexInQuadrantAndRing: number,
		): PolarCoordinate => {
			const quadrantIndex = quadrants[blip.quadrant] - 1;
			const quadrantBaseAngle = quadrantIndex * (Math.PI / 2);

			// Distribute blips evenly within their quadrant
			const anglePerBlip = Math.PI / 2 / (blipsInQuadrantAndRing + 1);
			const angle =
				quadrantBaseAngle + anglePerBlip * (blipIndexInQuadrantAndRing + 1);

			// Get the radius range for this ring
			const { innerRadius, outerRadius } = getRingRadiusRange(
				blip.ring as keyof typeof ringStatus,
				radius,
				maxRadius,
			);

			// Generate a deterministic position factor based on blip properties
			// Use the blip's name and ID to create a consistent value between 0.3 and 0.7
			const generateDeterministicFactor = (blip: Blip): number => {
				// Use the sum of character codes in the name as a seed
				const nameSeed = blip.name
					.split("")
					.reduce((sum, char) => sum + char.charCodeAt(0), 0);

				// Extract numeric value from ID (handles both number and string IDs)
				const extractNumericId = (id: string | number): number => {
					if (typeof id === "number") {
						return id;
					}
					// Convert string ID to number by removing non-digits
					return parseInt(String(id).replace(/\D/g, ""), 10) || 0;
				};

				// Combine with the numeric ID
				const idValue = extractNumericId(blip.id);

				// Create a value between 0 and 1 using modulo
				const rawFactor = ((nameSeed * 15 + idValue) % 100) / 100;

				// Scale to the desired range (0.3 to 0.7)
				return 0.5 + rawFactor * 0.5;
			};

			// Position blip at a point between inner and outer radius using deterministic factor
			const positionFactor = generateDeterministicFactor(blip);
			const blipRadius =
				innerRadius + (outerRadius - innerRadius) * positionFactor;

			return { angle, radius: blipRadius };
		},
		[radius, maxRadius],
	);

	return useMemo(() => {
		// Group blips by quadrant and ring
		const groupBlipsByQuadrantAndRing = (
			blips: Blip[],
		): Map<string, Blip[]> => {
			return blips.reduce((groups, blip) => {
				const key = `${blip.quadrant}-${blip.ring}`;
				if (!groups.has(key)) {
					groups.set(key, []);
				}
				groups.get(key)?.push(blip);
				return groups;
			}, new Map<string, Blip[]>());
		};

		const blipGroups = groupBlipsByQuadrantAndRing(blips);

		// Calculate initial positions
		const initialPositions: BlipWithPosition[] = blips.map((blip) => {
			const key = `${blip.quadrant}-${blip.ring}`;
			const blipsInGroup = blipGroups.get(key) || [];
			const indexInGroup = blipsInGroup.indexOf(blip);

			const { angle, radius } = calculatePolarCoordinates(
				blip,
				blipsInGroup.length,
				indexInGroup,
			);

			return {
				...blip,
				position: polarToCartesian(centerX, centerY, angle, radius),
			};
		});

		// Sort blips by ring to process more crowded rings first
		const sortByRingPriority = (
			blips: BlipWithPosition[],
		): BlipWithPosition[] => {
			const ringPriority = {
				Adopt: 0,
				Trial: 1,
				Assess: 2,
				Hold: 3,
			};

			const defaultPriority = 9999;

			return [...blips].sort(
				(a, b) =>
					(ringPriority[a.ring] ?? defaultPriority) -
					(ringPriority[b.ring] ?? defaultPriority),
			);
		};

		const sortedBlips = sortByRingPriority(initialPositions);

		// Apply collision avoidance algorithm
		const adjustPositions = (blips: BlipWithPosition[]): BlipWithPosition[] => {
			const result: BlipWithPosition[] = [];

			for (const blip of blips) {
				const adjustedBlip = findNonOverlappingPosition(
					blip,
					result,
					centerX,
					centerY,
					MIN_BLIP_DISTANCE,
				);

				// Ensure the blip stays within its correct ring boundaries after adjustment
				const { innerRadius, outerRadius } = getRingRadiusRange(
					blip.ring as keyof typeof ringStatus,
					radius,
					maxRadius,
				);
				const { angle, radius: currentRadius } = cartesianToPolar(
					adjustedBlip.position,
				);

				const INNER_BOUNDARY_BUFFER = 5; // Buffer from inner ring boundary
				const OUTER_BOUNDARY_BUFFER = 5; // Buffer from outer ring boundary

				// Determine the final radius using GenWrapper pattern with lookup table
				const isBelowInnerBoundary = currentRadius < innerRadius;
				const isAboveOuterBoundary = currentRadius > outerRadius;

				// Define radius adjustment strategies as a lookup table
				const radiusAdjustmentStrategies = {
					belowInner: () => innerRadius + INNER_BOUNDARY_BUFFER,
					aboveOuter: () => outerRadius - OUTER_BOUNDARY_BUFFER,
					withinBoundaries: () => currentRadius,
				};

				// Pure function to determine which strategy to use
				const getRadiusStrategy =
					(): keyof typeof radiusAdjustmentStrategies => {
						if (isBelowInnerBoundary) return "belowInner";
						if (isAboveOuterBoundary) return "aboveOuter";
						return "withinBoundaries";
					};

				// Generator function using functional approach
				function* radiusAdjustmentGen(): Generator<number> {
					// Use the strategy pattern with a single yield
					const strategy = getRadiusStrategy();
					yield radiusAdjustmentStrategies[strategy]();
				}

				// Use GenWrapper to get the appropriate radius adjustment
				const radiusGen = GenWrapper(radiusAdjustmentGen);
				const finalRadius = radiusGen.next() ?? currentRadius;

				// Create the final position based on whether radius needs adjustment
				const needsRadiusAdjustment = finalRadius !== currentRadius;
				const finalPosition = needsRadiusAdjustment
					? polarToCartesian(centerX, centerY, angle, finalRadius)
					: adjustedBlip.position;

				result.push({
					...adjustedBlip,
					position: finalPosition,
				});
			}

			return result;
		};

		return adjustPositions(sortedBlips);
	}, [blips, calculatePolarCoordinates, centerX, centerY, radius, maxRadius]);
};

export default useBlipPositions;

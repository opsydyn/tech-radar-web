import { formatISO, parseISO, startOfWeek, subWeeks } from "date-fns";

// Types following functional programming patterns
type DependabotPR = {
	readonly title: string;
	readonly merged_at: string;
	readonly category: DependencyCategory;
	readonly severity: Severity;
};

type WeeklyData = readonly [string, number];
type Severity = "patch" | "minor" | "major";
type DependencyCategory =
	| "Security"
	| "Frontend"
	| "Backend"
	| "DevTools"
	| "Testing"
	| "Infrastructure";

// Lookup tables for functional conditional logic
const DEPENDENCIES_BY_CATEGORY: Record<DependencyCategory, readonly string[]> =
	{
		Security: [
			"helmet",
			"express-rate-limit",
			"cors",
			"bcrypt",
			"jsonwebtoken",
			"crypto-js",
		],
		Frontend: [
			"react",
			"@types/react",
			"typescript",
			"vite",
			"@visx/xychart",
			"framer-motion",
		],
		Backend: [
			"express",
			"fastify",
			"drizzle-orm",
			"zod",
			"@astrojs/node",
			"pg",
		],
		DevTools: [
			"eslint",
			"prettier",
			"husky",
			"@biomejs/biome",
			"vitest",
			"playwright",
		],
		Testing: [
			"vitest",
			"@testing-library/react",
			"jest",
			"cypress",
			"@fast-check/vitest",
			"storybook",
		],
		Infrastructure: [
			"docker",
			"kubernetes",
			"terraform",
			"aws-sdk",
			"redis",
			"nginx",
		],
	} as const;

const VERSION_BY_SEVERITY: Record<Severity, string> = {
	patch: "1.0.1",
	minor: "1.1.0",
	major: "2.0.0",
} as const;

const CATEGORY_MULTIPLIERS: Record<DependencyCategory, number> = {
	Security: 0.8,
	Frontend: 1.2,
	Backend: 1.0,
	DevTools: 0.9,
	Testing: 0.7,
	Infrastructure: 0.6,
} as const;

const SEVERITY_WEIGHTS: Record<DependencyCategory, readonly Severity[]> = {
	Security: ["major", "minor", "patch"],
	Frontend: ["patch", "minor", "major"],
	Backend: ["patch", "minor", "major"],
	DevTools: ["patch", "minor", "major"],
	Testing: ["patch", "minor", "major"],
	Infrastructure: ["patch", "minor", "major"],
} as const;

const SEVERITY_PROBABILITIES: Record<DependencyCategory, readonly number[]> = {
	Security: [0.4, 0.4, 0.2], // More major updates for security
	Frontend: [0.6, 0.3, 0.1],
	Backend: [0.6, 0.3, 0.1],
	DevTools: [0.6, 0.3, 0.1],
	Testing: [0.6, 0.3, 0.1],
	Infrastructure: [0.6, 0.3, 0.1],
} as const;

// Color scheme lookup table
export const CATEGORY_COLOR_SCHEMES: Record<
	DependencyCategory,
	{ base: string; bright: string; badge: string }
> = {
	Security: { base: "#dc2626", bright: "#ef4444", badge: "#991b1b" },
	Frontend: { base: "#ea580c", bright: "#f97316", badge: "#c2410c" },
	Backend: { base: "#16a34a", bright: "#22c55e", badge: "#15803d" },
	DevTools: { base: "#2563eb", bright: "#3b82f6", badge: "#1d4ed8" },
	Testing: { base: "#7c3aed", bright: "#8b5cf6", badge: "#6d28d9" },
	Infrastructure: { base: "#0891b2", bright: "#06b6d4", badge: "#0e7490" },
} as const;

// Pure functions for data generation
const createPRTitle = (
	category: DependencyCategory,
	index: number,
	severity: Severity,
): string => {
	const dependencies = DEPENDENCIES_BY_CATEGORY[category];
	const dependency = dependencies[index % dependencies.length];
	const version = VERSION_BY_SEVERITY[severity];

	return `Bump ${dependency} from 1.0.0 to ${version} (${severity})`;
};

const createMergedDate = (weeksAgo: number): string => {
	const baseDate = new Date();
	const targetWeek = subWeeks(baseDate, weeksAgo);
	const weekStart = startOfWeek(targetWeek, { weekStartsOn: 1 });
	const randomDays = Math.floor(Math.random() * 7);
	const mergedDate = new Date(weekStart);

	mergedDate.setDate(mergedDate.getDate() + randomDays);
	return formatISO(mergedDate);
};

const selectSeverityByProbability = (
	category: DependencyCategory,
): Severity => {
	const weights = SEVERITY_WEIGHTS[category];
	const probabilities = SEVERITY_PROBABILITIES[category];

	return probabilities.reduce((acc, prob, index) => {
		const randomValue = Math.random();
		return randomValue <= prob ? weights[index] : acc;
	}, weights[0]);
};

const calculateAdjustedPRCount = (
	basePRCount: number,
	category: DependencyCategory,
): number => {
	const multiplier = CATEGORY_MULTIPLIERS[category];
	return Math.max(1, Math.floor(basePRCount * multiplier));
};

// Pure function to generate PRs for a single week
const generateWeekPRs = (
	category: DependencyCategory,
	weekIndex: number,
	startPRIndex: number,
): readonly DependabotPR[] => {
	const basePRCount = Math.floor(Math.random() * 4) + 1;
	const adjustedPRCount = calculateAdjustedPRCount(basePRCount, category);

	return Array.from({ length: adjustedPRCount }, (_, i) => ({
		title: createPRTitle(
			category,
			startPRIndex + i,
			selectSeverityByProbability(category),
		),
		merged_at: createMergedDate(weekIndex),
		category,
		severity: selectSeverityByProbability(category),
	}));
};

// Pure function to generate PRs for all weeks in a category
const generateCategoryPRs = (
	category: DependencyCategory,
	weekCount = 12,
): readonly DependabotPR[] => {
	return Array.from({ length: weekCount }, (_, weekIndex) =>
		generateWeekPRs(category, weekIndex, weekIndex * 4),
	).flat();
};

// Pure function to group PRs by week
const groupPRsByWeek = (
	prs: readonly DependabotPR[],
): readonly WeeklyData[] => {
	const groupedMap = prs.reduce((acc, pr) => {
		const week = formatISO(
			startOfWeek(parseISO(pr.merged_at), { weekStartsOn: 1 }),
			{ representation: "date" },
		);

		return acc.set(week, (acc.get(week) || 0) + 1);
	}, new Map<string, number>());

	return Array.from(groupedMap.entries()).sort(([a], [b]) =>
		a.localeCompare(b),
	);
};

// Pure function to create target data
const createTargetData = (
	actualData: readonly WeeklyData[],
	targetValue: number,
): readonly WeeklyData[] =>
	actualData.map(([week]) => [week, targetValue] as const);

// Pure function to filter PRs by category
const filterByCategory = (
	prs: readonly DependabotPR[],
	category: DependencyCategory,
): readonly DependabotPR[] => prs.filter((pr) => pr.category === category);

// Pure function to generate all categories
const generateAllCategories = (weekCount = 12): readonly DependabotPR[] => {
	const categories: readonly DependencyCategory[] = [
		"Security",
		"Frontend",
		"Backend",
		"DevTools",
		"Testing",
		"Infrastructure",
	];

	return categories.flatMap((category) =>
		generateCategoryPRs(category, weekCount),
	);
};

// Main service object with pure functions
export const mockDependabotService = {
	fetchAllMergedPRs: (): readonly DependabotPR[] => generateAllCategories(),

	fetchMergedPRsByCategory: (
		category: DependencyCategory,
	): readonly DependabotPR[] => generateCategoryPRs(category),

	getWeeklyBurndown: (): readonly WeeklyData[] =>
		groupPRsByWeek(generateAllCategories()),

	getWeeklyBurndownByCategory: (
		category: DependencyCategory,
	): readonly WeeklyData[] => groupPRsByWeek(generateCategoryPRs(category)),

	getBurndownWithTarget: (targetPRsPerWeek = 5) => {
		const actualData = mockDependabotService.getWeeklyBurndown();
		const targetData = createTargetData(actualData, targetPRsPerWeek);

		return { actual: actualData, target: targetData } as const;
	},

	getBurndownWithTargetByCategory: (
		category: DependencyCategory,
		targetPRsPerWeek = 3,
	) => {
		const actualData =
			mockDependabotService.getWeeklyBurndownByCategory(category);
		const targetData = createTargetData(actualData, targetPRsPerWeek);

		return { actual: actualData, target: targetData } as const;
	},
} as const;

// Export types
export type { DependabotPR, WeeklyData, DependencyCategory, Severity };

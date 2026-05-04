import { formatISO, parseISO, startOfWeek, subWeeks } from "date-fns";

// Types following functional programming patterns
export type ArchitectureViolation = {
	readonly id: string;
	readonly type: ArchitectureDebtType;
	readonly severity: ViolationSeverity;
	readonly module: string;
	readonly description: string;
	readonly detected_at: string;
	readonly resolved_at?: string;
	readonly impact_score: number;
	readonly effort_estimate: number;
};

export type ModuleComplexity = {
	readonly module: string;
	readonly layer: ArchitectureLayer;
	readonly complexity_score: number;
	readonly coupling_score: number;
	readonly lines_of_code: number;
	readonly dependencies_count: number;
	readonly violation_count: number;
};

export type LayerViolation = {
	readonly from_layer: ArchitectureLayer;
	readonly to_layer: ArchitectureLayer;
	readonly violation_count: number;
	readonly severity: ViolationSeverity;
};

export type CouplingMetric = {
	readonly source_module: string;
	readonly target_module: string;
	readonly coupling_strength: number;
	readonly coupling_type: CouplingType;
};

export type WeeklyArchData = readonly [string, number];

export type ComplexityMetric = {
	readonly module_name: string;
	readonly layer: ArchitectureLayer;
	readonly complexity_score: number;
	readonly cyclomatic_complexity: number;
	readonly dependency_count: number;
	readonly loc: number;
};

// Enums and types
export type ArchitectureDebtType =
	| "LayerViolation"
	| "CircularDependency"
	| "GodClass"
	| "FeatureEnvy"
	| "DataClump"
	| "LongParameterList"
	| "DeadCode"
	| "DuplicateCode"
	| "MissingAbstraction"
	| "TightCoupling";

export type ViolationSeverity = "critical" | "high" | "medium" | "low";

export type ArchitectureLayer =
	| "Presentation"
	| "Application"
	| "Domain"
	| "Infrastructure"
	| "Database"
	| "External";

export type CouplingType = "afferent" | "efferent" | "bidirectional";

// Lookup tables for functional conditional logic
const MODULES_BY_LAYER: Record<ArchitectureLayer, readonly string[]> = {
	Presentation: [
		"components/radar",
		"components/ui",
		"pages/tech-debt",
		"pages/adrs",
		"layouts/Layout",
		"components/charts",
	],
	Application: [
		"services/api",
		"stores/radar-store",
		"stores/theme-store",
		"hooks/useBlipSearch",
		"actions/copilot-runtime",
	],
	Domain: [
		"types/radar-types",
		"utils/quadrantColors",
		"utils/dateFormatter",
		"models/blip",
		"models/adr",
	],
	Infrastructure: [
		"db/drizzle-db",
		"db/drizzle-schema",
		"mastra/agents",
		"utils/mockDependabotData",
	],
	Database: [
		"migrations",
		"schemas/adr",
		"schemas/blip",
		"queries/blip",
		"queries/adr",
	],
	External: [
		"integrations/github",
		"integrations/openai",
		"integrations/neon",
		"apis/external",
	],
} as const;

const VIOLATION_TYPES_BY_LAYER: Record<
	ArchitectureLayer,
	readonly ArchitectureDebtType[]
> = {
	Presentation: [
		"GodClass",
		"FeatureEnvy",
		"LongParameterList",
		"DuplicateCode",
	],
	Application: [
		"CircularDependency",
		"TightCoupling",
		"MissingAbstraction",
		"DeadCode",
	],
	Domain: ["DataClump", "MissingAbstraction", "TightCoupling", "DuplicateCode"],
	Infrastructure: [
		"LayerViolation",
		"TightCoupling",
		"DeadCode",
		"CircularDependency",
	],
	Database: ["DeadCode", "DuplicateCode", "MissingAbstraction", "DataClump"],
	External: [
		"LayerViolation",
		"TightCoupling",
		"FeatureEnvy",
		"CircularDependency",
	],
} as const;

// Color schemes for different chart types
export const ARCHITECTURE_COLOR_SCHEMES: Record<
	ArchitectureLayer,
	{ base: string; bright: string; dark: string }
> = {
	Presentation: { base: "#3b82f6", bright: "#60a5fa", dark: "#1d4ed8" },
	Application: { base: "#10b981", bright: "#34d399", dark: "#047857" },
	Domain: { base: "#f59e0b", bright: "#fbbf24", dark: "#d97706" },
	Infrastructure: { base: "#ef4444", bright: "#f87171", dark: "#dc2626" },
	Database: { base: "#8b5cf6", bright: "#a78bfa", dark: "#7c3aed" },
	External: { base: "#06b6d4", bright: "#22d3ee", dark: "#0891b2" },
} as const;

export const VIOLATION_SEVERITY_COLORS: Record<ViolationSeverity, string> = {
	critical: "#dc2626",
	high: "#ea580c",
	medium: "#ca8a04",
	low: "#16a34a",
} as const;

// Pure functions for data generation
const selectRandomFromArray = <T>(array: readonly T[]): T =>
	array[Math.floor(Math.random() * array.length)];

const selectSeverityByType = (
	type: ArchitectureDebtType,
): ViolationSeverity => {
	const severityMap: Record<
		ArchitectureDebtType,
		readonly ViolationSeverity[]
	> = {
		LayerViolation: ["critical", "high", "medium"],
		CircularDependency: ["critical", "high"],
		GodClass: ["high", "medium", "low"],
		FeatureEnvy: ["medium", "low"],
		DataClump: ["medium", "low"],
		LongParameterList: ["low", "medium"],
		DeadCode: ["low"],
		DuplicateCode: ["medium", "low"],
		MissingAbstraction: ["high", "medium"],
		TightCoupling: ["high", "medium", "low"],
	};

	return selectRandomFromArray(severityMap[type]);
};

const createDetectedDate = (weeksAgo: number): string => {
	const baseDate = new Date();
	const targetWeek = subWeeks(baseDate, weeksAgo);
	const weekStart = startOfWeek(targetWeek, { weekStartsOn: 1 });
	const randomDays = Math.floor(Math.random() * 7);
	const detectedDate = new Date(weekStart);

	detectedDate.setDate(detectedDate.getDate() + randomDays);
	return formatISO(detectedDate);
};

// Main service object using functional composition
export const mockArchitectureDebtService = {
	// Generate violations for trend analysis
	getViolationTrends: (weekCount = 12): readonly WeeklyArchData[] => {
		const violations = Array.from({ length: weekCount * 5 }, (_, i) => {
			const layer = selectRandomFromArray(
				Object.keys(MODULES_BY_LAYER) as ArchitectureLayer[],
			);
			const type = selectRandomFromArray(VIOLATION_TYPES_BY_LAYER[layer]);
			return [createDetectedDate(Math.floor(i / 5)), 1] as const;
		});

		return violations
			.reduce((acc, [date]) => {
				const week = formatISO(
					startOfWeek(parseISO(date), { weekStartsOn: 1 }),
				);
				const existing = acc.find(([w]) => w === week);

				if (existing) {
					return acc.map(([w, count]) =>
						w === week ? ([w, count + 1] as const) : ([w, count] as const),
					);
				}

				return [...acc, [week, 1] as const];
			}, [] as WeeklyArchData[])
			.sort(([a], [b]) => a.localeCompare(b));
	},

	// Get module complexity for heatmap
	getModuleComplexityMatrix: (): readonly ModuleComplexity[] => {
		return Object.entries(MODULES_BY_LAYER).flatMap(([layer, modules]) =>
			modules.map((module) => ({
				module,
				layer: layer as ArchitectureLayer,
				complexity_score: Math.floor(Math.random() * 100) + 1,
				coupling_score: Math.floor(Math.random() * 50) + 1,
				lines_of_code: Math.floor(Math.random() * 2000) + 100,
				dependencies_count: Math.floor(Math.random() * 20) + 1,
				violation_count: Math.floor(Math.random() * 10),
			})),
		);
	},

	// Get coupling data for network diagram
	getCouplingNetwork: (): readonly CouplingMetric[] => {
		const allModules = Object.values(MODULES_BY_LAYER).flat();
		const couplingMetrics: CouplingMetric[] = [];

		allModules.forEach((sourceModule) => {
			const couplingCount = Math.floor(Math.random() * 3) + 1;
			const targets = allModules
				.filter((m) => m !== sourceModule)
				.sort(() => 0.5 - Math.random())
				.slice(0, couplingCount);

			targets.forEach((targetModule) => {
				couplingMetrics.push({
					source_module: sourceModule,
					target_module: targetModule,
					coupling_strength: Math.floor(Math.random() * 100) + 1,
					coupling_type: selectRandomFromArray([
						"afferent",
						"efferent",
						"bidirectional",
					]),
				});
			});
		});

		return couplingMetrics;
	},

	// Get layer violations for Sankey diagram
	getLayerViolations: (): readonly LayerViolation[] => {
		const layers = Object.keys(MODULES_BY_LAYER) as ArchitectureLayer[];
		const violations: LayerViolation[] = [];

		layers.forEach((fromLayer) => {
			layers.forEach((toLayer) => {
				if (fromLayer !== toLayer) {
					const violationCount = Math.floor(Math.random() * 8);
					if (violationCount > 0) {
						violations.push({
							from_layer: fromLayer,
							to_layer: toLayer,
							violation_count: violationCount,
							severity: selectRandomFromArray([
								"critical",
								"high",
								"medium",
								"low",
							]),
						});
					}
				}
			});
		});

		return violations;
	},

	// Get violation breakdown for pie chart
	getViolationBreakdown: (): Record<ArchitectureDebtType, number> => {
		const allTypes: ArchitectureDebtType[] = [
			"LayerViolation",
			"CircularDependency",
			"GodClass",
			"FeatureEnvy",
			"DataClump",
			"LongParameterList",
			"DeadCode",
			"DuplicateCode",
			"MissingAbstraction",
			"TightCoupling",
		];

		return allTypes.reduce(
			(acc, type) => ({
				...acc,
				[type]: Math.floor(Math.random() * 20) + 1,
			}),
			{} as Record<ArchitectureDebtType, number>,
		);
	},
} as const;

// Mock data for module complexity
export const mockArchitectureData: ComplexityMetric[] = [
	{
		module_name: "components/BlipDetail",
		layer: "Presentation",
		complexity_score: 75,
		cyclomatic_complexity: 12,
		dependency_count: 8,
		loc: 450,
	},
	{
		module_name: "components/RadarChart",
		layer: "Presentation",
		complexity_score: 85,
		cyclomatic_complexity: 15,
		dependency_count: 10,
		loc: 650,
	},
	{
		module_name: "services/BlipService",
		layer: "Application",
		complexity_score: 65,
		cyclomatic_complexity: 8,
		dependency_count: 5,
		loc: 250,
	},
	{
		module_name: "services/RadarService",
		layer: "Application",
		complexity_score: 70,
		cyclomatic_complexity: 10,
		dependency_count: 6,
		loc: 300,
	},
	{
		module_name: "models/Blip",
		layer: "Domain",
		complexity_score: 45,
		cyclomatic_complexity: 5,
		dependency_count: 3,
		loc: 150,
	},
	{
		module_name: "models/Radar",
		layer: "Domain",
		complexity_score: 50,
		cyclomatic_complexity: 6,
		dependency_count: 4,
		loc: 180,
	},
	{
		module_name: "db/BlipRepository",
		layer: "Infrastructure",
		complexity_score: 60,
		cyclomatic_complexity: 7,
		dependency_count: 4,
		loc: 200,
	},
	{
		module_name: "db/RadarRepository",
		layer: "Infrastructure",
		complexity_score: 55,
		cyclomatic_complexity: 6,
		dependency_count: 3,
		loc: 180,
	},
];

// Mock data for module coupling
export const mockCouplingData: CouplingMetric[] = [
	// Presentation Layer Dependencies
	{
		source_module: "components/BlipDetail",
		target_module: "services/BlipService",
		coupling_strength: 0.8,
		coupling_type: "efferent",
	},
	{
		source_module: "components/RadarChart",
		target_module: "services/RadarService",
		coupling_strength: 0.9,
		coupling_type: "efferent",
	},
	{
		source_module: "components/ArchitectureHeatmap",
		target_module: "utils/mockArchitectureData",
		coupling_strength: 0.7,
		coupling_type: "efferent",
	},
	{
		source_module: "pages/tech-debt",
		target_module: "components/ArchitectureCouplingNetwork",
		coupling_strength: 0.6,
		coupling_type: "efferent",
	},
	{
		source_module: "pages/adrs",
		target_module: "stores/radar-store",
		coupling_strength: 0.75,
		coupling_type: "efferent",
	},

	// Application Layer Dependencies
	{
		source_module: "services/BlipService",
		target_module: "models/Blip",
		coupling_strength: 0.85,
		coupling_type: "bidirectional",
	},
	{
		source_module: "services/RadarService",
		target_module: "models/Radar",
		coupling_strength: 0.8,
		coupling_type: "bidirectional",
	},
	{
		source_module: "stores/radar-store",
		target_module: "services/RadarService",
		coupling_strength: 0.7,
		coupling_type: "efferent",
	},
	{
		source_module: "hooks/useBlipSearch",
		target_module: "services/BlipService",
		coupling_strength: 0.65,
		coupling_type: "efferent",
	},

	// Domain Layer Dependencies
	{
		source_module: "models/Blip",
		target_module: "db/BlipRepository",
		coupling_strength: 0.7,
		coupling_type: "efferent",
	},
	{
		source_module: "models/Radar",
		target_module: "db/RadarRepository",
		coupling_strength: 0.75,
		coupling_type: "efferent",
	},
	{
		source_module: "models/Blip",
		target_module: "types/radar-types",
		coupling_strength: 0.5,
		coupling_type: "efferent",
	},

	// Infrastructure Layer Dependencies
	{
		source_module: "db/BlipRepository",
		target_module: "integrations/neon",
		coupling_strength: 0.8,
		coupling_type: "efferent",
	},
	{
		source_module: "db/RadarRepository",
		target_module: "integrations/neon",
		coupling_strength: 0.8,
		coupling_type: "efferent",
	},
	{
		source_module: "mastra/agents",
		target_module: "integrations/openai",
		coupling_strength: 0.9,
		coupling_type: "efferent",
	},

	// External Dependencies
	{
		source_module: "integrations/github",
		target_module: "apis/external",
		coupling_strength: 0.6,
		coupling_type: "bidirectional",
	},
	{
		source_module: "integrations/openai",
		target_module: "apis/external",
		coupling_strength: 0.7,
		coupling_type: "bidirectional",
	},

	// Cross-layer Violations
	{
		source_module: "components/BlipDetail",
		target_module: "db/BlipRepository",
		coupling_strength: 0.4,
		coupling_type: "efferent",
	},
	{
		source_module: "services/BlipService",
		target_module: "apis/external",
		coupling_strength: 0.3,
		coupling_type: "efferent",
	},

	// Incoming Dependencies
	{
		source_module: "db/BlipRepository",
		target_module: "models/Blip",
		coupling_strength: 0.6,
		coupling_type: "afferent",
	},
	{
		source_module: "db/RadarRepository",
		target_module: "models/Radar",
		coupling_strength: 0.65,
		coupling_type: "afferent",
	},
	{
		source_module: "services/BlipService",
		target_module: "hooks/useBlipSearch",
		coupling_strength: 0.5,
		coupling_type: "afferent",
	},
];

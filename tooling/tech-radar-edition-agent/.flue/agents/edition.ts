import type { FlueContext, SessionData, SessionStore } from "@flue/sdk/client";
import * as v from "valibot";
import {
	buildEditionMdx,
	createEditionDraftContext,
	defaultRepoRoot,
	type EditionAiProvenance,
	type EditionAiProvenanceEntry,
} from "../../src/editionDraft";

export const triggers = {};

const payloadSchema = v.object({
	repoRoot: v.optional(v.string()),
	runDate: v.optional(v.string()),
	model: v.optional(v.string()),
	librarianSummarySeed: v.optional(v.string()),
	viewsContext: v.optional(v.string()),
	recommendationsContext: v.optional(v.string()),
	aiProvenanceNotes: v.optional(v.array(v.string())),
});

const editionNarrativeSchema = v.object({
	introduction: v.string(),
	highlights: v.array(v.string()),
	librarianSummary: v.string(),
	viewsSummary: v.string(),
	recommendationsSummary: v.string(),
	newEntriesSummary: v.string(),
	movedOutSummary: v.string(),
	conclusion: v.string(),
	aiProvenanceIntro: v.optional(v.string()),
	provenanceBulletPoints: v.array(v.string()),
});

const aiProvenanceEntrySchema = v.object({
	feature: v.string(),
	kind: v.picklist(["ai", "deterministic"]),
	provider: v.string(),
	model: v.string(),
	items: v.number(),
	calls: v.number(),
	inputTokens: v.number(),
	outputTokens: v.number(),
	cacheReadTokens: v.number(),
	cacheWriteTokens: v.number(),
	totalTokens: v.number(),
	notes: v.array(v.string()),
});

const aiProvenanceSchema = v.object({
	captureStatus: v.picklist(["captured", "missing"]),
	auditEngine: v.string(),
	generatedBy: v.string(),
	entries: v.array(aiProvenanceEntrySchema),
});

const editionResultSchema = v.object({
	editionNumber: v.number(),
	fileName: v.string(),
	title: v.string(),
	date: v.string(),
	aiProvenance: aiProvenanceSchema,
	mdx: v.string(),
});

const editionEnvelopeSchema = v.object({
	kind: v.literal("EditionAgentResult"),
	result: editionResultSchema,
});

const defaultModel = "openai/gpt-4.1-mini";

type UsageLike = {
	readonly input?: number;
	readonly output?: number;
	readonly cacheRead?: number;
	readonly cacheWrite?: number;
	readonly totalTokens?: number;
};

type UsageTotals = {
	readonly inputTokens: number;
	readonly outputTokens: number;
	readonly cacheReadTokens: number;
	readonly cacheWriteTokens: number;
	readonly totalTokens: number;
	readonly calls: number;
};

const createCapturingSessionStore = (): SessionStore & {
	readonly getLatestData: () => SessionData | null;
} => {
	const store = new Map<string, SessionData>();
	let latestData: SessionData | null = null;

	return {
		save: async (id, data) => {
			store.set(id, data);
			latestData = data;
		},
		load: async (id) => store.get(id) ?? null,
		delete: async (id) => {
			store.delete(id);
			latestData = store.values().next().value ?? null;
		},
		getLatestData: () => latestData,
	};
};

const splitModel = (model: string) => {
	const [provider, ...modelParts] = model.split("/");

	return {
		provider: provider ?? "unknown",
		modelId: modelParts.join("/") || "unknown",
	};
};

const toNumber = (value: unknown) => (typeof value === "number" ? value : 0);

const toUsageLike = (value: unknown): UsageLike | null => {
	if (!value || typeof value !== "object") {
		return null;
	}

	const candidate = value as Record<string, unknown>;
	const hasKnownUsageField = [
		"input",
		"output",
		"cacheRead",
		"cacheWrite",
		"totalTokens",
	].some((key) => typeof candidate[key] === "number");

	return hasKnownUsageField
		? {
				input: toNumber(candidate.input),
				output: toNumber(candidate.output),
				cacheRead: toNumber(candidate.cacheRead),
				cacheWrite: toNumber(candidate.cacheWrite),
				totalTokens: toNumber(candidate.totalTokens),
			}
		: null;
};

const extractAssistantUsages = (
	data: SessionData | null,
): ReadonlyArray<UsageLike> => {
	if (!data) {
		return [];
	}

	return data.entries.flatMap((entry) => {
		if (entry.type !== "message") {
			return [];
		}

		const message = entry.message as unknown as Record<string, unknown>;
		const isAssistantMessage = message.role === "assistant";
		const usage = toUsageLike(message.usage);

		return isAssistantMessage && usage ? [usage] : [];
	});
};

const sumUsage = (usages: ReadonlyArray<UsageLike>): UsageTotals => {
	const totals = usages.reduce<UsageTotals>(
		(accumulator, usage) => {
			const input = usage.input ?? 0;
			const output = usage.output ?? 0;
			const cacheRead = usage.cacheRead ?? 0;
			const cacheWrite = usage.cacheWrite ?? 0;
			const totalTokens =
				usage.totalTokens ?? input + output + cacheRead + cacheWrite;

			return {
				inputTokens: accumulator.inputTokens + input,
				outputTokens: accumulator.outputTokens + output,
				cacheReadTokens: accumulator.cacheReadTokens + cacheRead,
				cacheWriteTokens: accumulator.cacheWriteTokens + cacheWrite,
				totalTokens: accumulator.totalTokens + totalTokens,
				calls: accumulator.calls,
			};
		},
		{
			inputTokens: 0,
			outputTokens: 0,
			cacheReadTokens: 0,
			cacheWriteTokens: 0,
			totalTokens: 0,
			calls: 0,
		},
	);

	return {
		inputTokens: totals.inputTokens,
		outputTokens: totals.outputTokens,
		cacheReadTokens: totals.cacheReadTokens,
		cacheWriteTokens: totals.cacheWriteTokens,
		totalTokens: totals.totalTokens,
		calls: usages.length,
	};
};

const buildAiProvenance = (
	resolvedModel: string,
	usageEntries: ReadonlyArray<UsageLike>,
): EditionAiProvenance => {
	const { provider, modelId } = splitModel(resolvedModel);
	const usageTotals = sumUsage(usageEntries);
	const aiCaptureSucceeded = usageEntries.length > 0;
	const aiEntry: EditionAiProvenanceEntry = {
		feature: "compose-edition",
		kind: "ai",
		provider,
		model: modelId,
		items: 1,
		calls: usageTotals.calls,
		inputTokens: usageTotals.inputTokens,
		outputTokens: usageTotals.outputTokens,
		cacheReadTokens: usageTotals.cacheReadTokens,
		cacheWriteTokens: usageTotals.cacheWriteTokens,
		totalTokens: usageTotals.totalTokens,
		notes: aiCaptureSucceeded
			? [
					"Token totals include the structured result-extraction pass used by the schema boundary.",
				]
			: ["Token usage was not returned by the provider for this run."],
	};
	const deterministicEntry: EditionAiProvenanceEntry = {
		feature: "edition-metadata",
		kind: "deterministic",
		provider: "none",
		model: "deterministic-frontmatter",
		items: 1,
		calls: 0,
		inputTokens: 0,
		outputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		totalTokens: 0,
		notes: [
			"Edition number, file name, title, and date were generated deterministically.",
		],
	};

	return v.parse(aiProvenanceSchema, {
		captureStatus: aiCaptureSucceeded ? "captured" : "missing",
		auditEngine: "captured Flue session usage",
		generatedBy: "tech-radar-edition-agent",
		entries: [aiEntry, deterministicEntry],
	});
};

export default async function ({ init, payload }: FlueContext) {
	const input = v.parse(payloadSchema, payload ?? {});
	const selectedModel = input.model ?? defaultModel;
	const sessionStore = createCapturingSessionStore();
	const context = await createEditionDraftContext({
		repoRoot: input.repoRoot ?? defaultRepoRoot,
		runDate: input.runDate,
	});
	const agent = await init({
		sandbox: "local",
		persist: sessionStore,
		model: selectedModel,
		role: "project-librarian",
	});
	const session = await agent.session();
	const provenanceNotes = [
		`Edition number ${context.nextEditionNumber}, file name ${context.fileName}, title, and date were generated deterministically.`,
		"This phase-1 slice uses AI for free-text synthesis only; Astro edition frontmatter remains deterministic.",
		...(input.aiProvenanceNotes ?? []),
	];
	const previousEditionTitles = context.existingEditions
		.slice(-3)
		.map((edition) => `Edition ${edition.number}: ${edition.title}`);
	const narrative = await session.skill("compose-edition", {
		args: {
			nextEditionNumber: context.nextEditionNumber,
			title: context.title,
			isoDate: context.isoDate,
			monthLabel: context.monthLabel,
			fileName: context.fileName,
			previousEditionTitles,
			librarianSummarySeed:
				input.librarianSummarySeed ??
				"Summarize the tech radar like a careful project librarian: crisp, warm, and evidence-aware.",
			viewsContext:
				input.viewsContext ??
				"No concrete page-view metrics were provided for this run. Acknowledge any missing or partial signals without inventing numbers.",
			recommendationsContext:
				input.recommendationsContext ??
				"Summarize the most notable technology recommendations in free text and keep them pragmatic.",
			provenanceNotes,
		},
		role: "project-librarian",
		result: editionNarrativeSchema,
	});
	const aiProvenance = buildAiProvenance(
		selectedModel,
		extractAssistantUsages(sessionStore.getLatestData()),
	);

	return v.parse(editionEnvelopeSchema, {
		kind: "EditionAgentResult",
		result: {
			editionNumber: context.nextEditionNumber,
			fileName: context.fileName,
			title: context.title,
			date: context.isoDate,
			aiProvenance,
			mdx: buildEditionMdx(context, narrative, aiProvenance),
		},
	});
}

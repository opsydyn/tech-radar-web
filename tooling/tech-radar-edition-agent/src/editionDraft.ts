import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { DateTime, Effect, Option, pipe, Schema } from "effect";
import matter from "gray-matter";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

const defaultContentSummary =
	"AI-generated tech radar edition with librarian summary, views, recommendations, and provenance";
const defaultProvenanceIntro =
	"This edition mixes deterministic metadata generation with AI-assisted narrative synthesis.";

const ExistingEditionSchema = Schema.Struct({
	id: Schema.String,
	number: Schema.Number,
	title: Schema.String,
});

type ExistingEdition = typeof ExistingEditionSchema.Type;

export type EditionDraftContext = {
	readonly repoRoot: string;
	readonly editionDirectory: string;
	readonly existingEditions: ReadonlyArray<ExistingEdition>;
	readonly nextEditionNumber: number;
	readonly fileName: string;
	readonly title: string;
	readonly isoDate: string;
	readonly monthLabel: string;
};

export type EditionNarrative = {
	readonly introduction: string;
	readonly highlights: ReadonlyArray<string>;
	readonly librarianSummary: string;
	readonly viewsSummary: string;
	readonly recommendationsSummary: string;
	readonly newEntriesSummary: string;
	readonly movedOutSummary: string;
	readonly conclusion: string;
	readonly aiProvenanceIntro?: string;
	readonly provenanceBulletPoints: ReadonlyArray<string>;
};

export type EditionAiProvenanceEntry = {
	readonly feature: string;
	readonly kind: "ai" | "deterministic";
	readonly provider: string;
	readonly model: string;
	readonly items: number;
	readonly calls: number;
	readonly inputTokens: number;
	readonly outputTokens: number;
	readonly cacheReadTokens: number;
	readonly cacheWriteTokens: number;
	readonly totalTokens: number;
	readonly notes: ReadonlyArray<string>;
};

export type EditionAiProvenance = {
	readonly captureStatus: "captured" | "missing";
	readonly auditEngine: string;
	readonly generatedBy: string;
	readonly entries: ReadonlyArray<EditionAiProvenanceEntry>;
};

const editionDirectoryForRoot = (repoRoot: string) =>
	path.join(repoRoot, "apps", "astro", "src", "content", "edition");

const isoDateFor = (input: Date) => input.toISOString().slice(0, 10);

const monthLabelFor = (input: Date) =>
	`${monthNames[input.getUTCMonth()]} ${input.getUTCFullYear()}`;

const zeroPad = (value: number) => String(value).padStart(2, "0");

const fileNameFor = (input: Date, nextEditionNumber: number) =>
	`${input.getUTCFullYear()}-${zeroPad(input.getUTCMonth() + 1)}-tech-radar-edition-${nextEditionNumber}.mdx`;

const titleFor = (nextEditionNumber: number, monthLabel: string) =>
	`Tech Radar Edition ${nextEditionNumber} - ${monthLabel}`;

const decodeExistingEdition = Schema.decodeUnknownOption(ExistingEditionSchema);

const parseExistingEdition = (
	fileContents: string,
): Option.Option<ExistingEdition> =>
	pipe(matter(fileContents).data, decodeExistingEdition);

const compareEditions = (left: ExistingEdition, right: ExistingEdition) =>
	left.number - right.number;

const toSingletonArray = <A>(option: Option.Option<A>): ReadonlyArray<A> =>
	Option.match(option, {
		onNone: () => [],
		onSome: (value) => [value],
	});

const collectExistingEditions = (
	parsedEditions: ReadonlyArray<Option.Option<ExistingEdition>>,
): ReadonlyArray<ExistingEdition> =>
	parsedEditions.flatMap(toSingletonArray).sort(compareEditions);

const readEditionDirectory = (editionDirectory: string) =>
	Effect.promise(() =>
		fs.readdir(editionDirectory, {
			withFileTypes: true,
		}),
	);

const readEditionFile = (editionDirectory: string, fileName: string) =>
	Effect.promise(() =>
		fs.readFile(path.join(editionDirectory, fileName), "utf8"),
	);

const readExistingEditions = (editionDirectory: string) =>
	pipe(
		readEditionDirectory(editionDirectory),
		Effect.map((directoryEntries) =>
			directoryEntries
				.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
				.map((entry) => entry.name),
		),
		Effect.flatMap((editionFiles) =>
			Effect.forEach(
				editionFiles,
				(fileName) =>
					pipe(
						readEditionFile(editionDirectory, fileName),
						Effect.map(parseExistingEdition),
					),
				{ concurrency: "unbounded" },
			),
		),
		Effect.map(collectExistingEditions),
	);

const resolveRunDate = (runDate: string | undefined): Date =>
	pipe(
		Option.fromUndefinedOr(runDate),
		Option.flatMap(DateTime.make),
		Option.map((value) => new Date(value.epochMilliseconds)),
		Option.match({
			onNone: () => new Date(),
			onSome: (value) => value,
		}),
	);

const bulletList = (items: ReadonlyArray<string>, fallback: string) =>
	items.length > 0
		? items.map((item) => `- ${item}`).join("\n")
		: `- ${fallback}`;

const section = (title: string, body: string) =>
	`## ${title}\n\n${body.trim()}`;

const markdownTable = (
	headers: ReadonlyArray<string>,
	rows: ReadonlyArray<ReadonlyArray<string | number>>,
) =>
	[
		`| ${headers.join(" | ")} |`,
		`| ${headers.map(() => "---").join(" | ")} |`,
		...rows.map((row) => `| ${row.map(String).join(" | ")} |`),
	].join("\n");

const sumTotalTokens = (entries: ReadonlyArray<EditionAiProvenanceEntry>) =>
	entries.reduce((total, entry) => total + entry.totalTokens, 0);

const buildProvenanceSummary = (aiProvenance: EditionAiProvenance) =>
	bulletList(
		[
			`Capture status: ${aiProvenance.captureStatus}.`,
			`Audit engine: ${aiProvenance.auditEngine}.`,
			`Generated by: ${aiProvenance.generatedBy}.`,
			`Total recorded tokens: ${sumTotalTokens(aiProvenance.entries)}.`,
		],
		"No structured provenance summary was generated.",
	);

const buildProvenanceTable = (aiProvenance: EditionAiProvenance) =>
	markdownTable(
		[
			"Feature",
			"Kind",
			"Provider",
			"Model",
			"Items",
			"Calls",
			"Input tokens",
			"Output tokens",
			"Total tokens",
		],
		aiProvenance.entries.map((entry) => [
			entry.feature,
			entry.kind,
			entry.provider,
			entry.model,
			entry.items,
			entry.calls,
			entry.inputTokens,
			entry.outputTokens,
			entry.totalTokens,
		]),
	);

const buildProvenanceNotes = (aiProvenance: EditionAiProvenance) =>
	bulletList(
		aiProvenance.entries.flatMap((entry) =>
			entry.notes.map((note) => `${entry.feature}: ${note}`),
		),
		"No additional provenance notes were generated.",
	);

export const defaultRepoRoot = path.resolve(currentDirectory, "../../..");

export const createEditionDraftContext = async (input: {
	repoRoot?: string;
	runDate?: string;
}): Promise<EditionDraftContext> => {
	return Effect.runPromise(
		Effect.gen(function* () {
			const repoRoot = input.repoRoot ?? defaultRepoRoot;
			const editionDirectory = editionDirectoryForRoot(repoRoot);
			const existingEditions = yield* readExistingEditions(editionDirectory);
			const nextEditionNumber =
				existingEditions.reduce(
					(highest, edition) => Math.max(highest, edition.number),
					0,
				) + 1;
			const runDate = resolveRunDate(input.runDate);
			const isoDate = isoDateFor(runDate);
			const monthLabel = monthLabelFor(runDate);

			return {
				repoRoot,
				editionDirectory,
				existingEditions,
				nextEditionNumber,
				fileName: fileNameFor(runDate, nextEditionNumber),
				title: titleFor(nextEditionNumber, monthLabel),
				isoDate,
				monthLabel,
			};
		}),
	);
};

export const buildEditionMdx = (
	context: EditionDraftContext,
	narrative: EditionNarrative,
	aiProvenance: EditionAiProvenance,
): string => {
	const provenanceIntro = pipe(
		Option.fromUndefinedOr(narrative.aiProvenanceIntro),
		Option.map((value) => value.trim()),
		Option.filter((value) => value.length > 0),
		Option.match({
			onNone: () => defaultProvenanceIntro,
			onSome: (value) => value,
		}),
	);
	const contentSummary = `${defaultContentSummary} (${context.monthLabel})`;
	const body = [
		`# ${context.title}`,
		"",
		section("Introduction", narrative.introduction),
		"",
		section(
			"Highlights",
			bulletList(
				narrative.highlights,
				"No highlights were generated for this run.",
			),
		),
		"",
		section("Librarian Summary", narrative.librarianSummary),
		"",
		section("Views", narrative.viewsSummary),
		"",
		section("Tech Recommendations", narrative.recommendationsSummary),
		"",
		section("New Entries", narrative.newEntriesSummary),
		"",
		section("Moved Out", narrative.movedOutSummary),
		"",
		section(
			"AI Provenance",
			[
				provenanceIntro,
				"",
				bulletList(
					narrative.provenanceBulletPoints,
					"No AI provenance bullet points were generated.",
				),
				"",
				"### Metadata Summary",
				"",
				buildProvenanceSummary(aiProvenance),
				"",
				"### Token Breakdown",
				"",
				buildProvenanceTable(aiProvenance),
				"",
				"### Notes",
				"",
				buildProvenanceNotes(aiProvenance),
			].join("\n"),
		),
		"",
		section("Conclusion", narrative.conclusion),
	].join("\n");

	return matter
		.stringify(
			body,
			{
				id: String(context.nextEditionNumber),
				number: context.nextEditionNumber,
				title: context.title,
				content: contentSummary,
				date: context.isoDate,
				aiProvenance,
			},
			{
				language: "yaml",
			},
		)
		.trim();
};

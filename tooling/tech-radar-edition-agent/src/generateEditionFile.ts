import { execFile } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Effect, Match, Option, pipe, Schema } from "effect";
import matter from "gray-matter";

const execFileAsync = promisify(execFile);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDirectory, "..");
const repoRoot = path.resolve(currentDirectory, "../../..");
const generatedDirectory = path.join(packageRoot, ".generated");
const editionDirectory = path.join(
	repoRoot,
	"apps",
	"astro",
	"src",
	"content",
	"edition",
);

const editionEnvelopePattern =
	/\{\s*"kind":\s*"EditionAgentResult"[\s\S]*?\n\}(?=\n\[flue\] Done\.|\s*$)/m;

const CaptureStatusSchema = Schema.Union([
	Schema.Literal("captured"),
	Schema.Literal("missing"),
]);

const ProvenanceKindSchema = Schema.Union([
	Schema.Literal("ai"),
	Schema.Literal("deterministic"),
]);

const EditionAiProvenanceEntrySchema = Schema.Struct({
	feature: Schema.String,
	kind: ProvenanceKindSchema,
	provider: Schema.String,
	model: Schema.String,
	items: Schema.Number,
	calls: Schema.Number,
	inputTokens: Schema.Number,
	outputTokens: Schema.Number,
	cacheReadTokens: Schema.Number,
	cacheWriteTokens: Schema.Number,
	totalTokens: Schema.Number,
	notes: Schema.Array(Schema.String),
});

const EditionAiProvenanceSchema = Schema.Struct({
	captureStatus: CaptureStatusSchema,
	auditEngine: Schema.String,
	generatedBy: Schema.String,
	entries: Schema.Array(EditionAiProvenanceEntrySchema),
});

const EditionResultSchema = Schema.Struct({
	editionNumber: Schema.Number,
	fileName: Schema.String,
	title: Schema.String,
	date: Schema.String,
	aiProvenance: EditionAiProvenanceSchema,
	mdx: Schema.String,
});

const EditionEnvelopeSchema = Schema.Struct({
	kind: Schema.Literal("EditionAgentResult"),
	result: EditionResultSchema,
});

const EditionFrontmatterSchema = Schema.Struct({
	id: Schema.String,
	number: Schema.Number,
	title: Schema.String,
	content: Schema.String,
	date: Schema.Union([Schema.String, Schema.DateValid]),
	aiProvenance: EditionAiProvenanceSchema,
});

const PersistedEditionResultSchema = Schema.Struct({
	editionNumber: Schema.Number,
	fileName: Schema.String,
	title: Schema.String,
	date: Schema.String,
	aiProvenance: EditionAiProvenanceSchema,
	mdx: Schema.String,
	filePath: Schema.String,
});

type EditionResult = typeof EditionResultSchema.Type;
type EditionEnvelope = typeof EditionEnvelopeSchema.Type;
type EditionFrontmatter = typeof EditionFrontmatterSchema.Type;
type PersistedEditionResult = typeof PersistedEditionResultSchema.Type;

const decodeEditionResult = Schema.decodeUnknownSync(EditionResultSchema);
const decodeEditionEnvelope = Schema.decodeUnknownSync(EditionEnvelopeSchema);
const decodeEditionFrontmatter = Schema.decodeUnknownSync(
	EditionFrontmatterSchema,
);

const buildPayload = () =>
	pipe(
		Option.fromUndefinedOr(process.env.RUN_DATE),
		Option.match({
			onNone: () => ({}),
			onSome: (runDate) => ({ runDate }),
		}),
	);

const buildEditionRunId = () =>
	process.env.EDITION_RUN_ID ?? `edition-${Date.now()}`;

const normalizeFrontmatterDate = (date: EditionFrontmatter["date"]): string =>
	typeof date === "string" ? date : date.toISOString().slice(0, 10);

const parseEditionFrontmatter = (mdx: string): EditionFrontmatter =>
	decodeEditionFrontmatter(matter(mdx).data);

const validateGeneratedEdition = (result: EditionResult): EditionResult => {
	const frontmatter = parseEditionFrontmatter(result.mdx);
	const hasMatchingNumber = frontmatter.number === result.editionNumber;
	const hasMatchingTitle = frontmatter.title === result.title;
	const hasMatchingDate =
		normalizeFrontmatterDate(frontmatter.date) === result.date;
	const hasMatchingAiProvenance =
		JSON.stringify(frontmatter.aiProvenance) ===
		JSON.stringify(result.aiProvenance);

	return Match.value({
		hasMatchingNumber,
		hasMatchingTitle,
		hasMatchingDate,
		hasMatchingAiProvenance,
	}).pipe(
		Match.when(
			{
				hasMatchingNumber: true,
				hasMatchingTitle: true,
				hasMatchingDate: true,
				hasMatchingAiProvenance: true,
			},
			() => result,
		),
		Match.orElse(() => {
			throw new Error(
				"Generated MDX frontmatter does not match the edition result metadata.",
			);
		}),
	);
};

const extractEditionEnvelope = (rawOutput: string): EditionEnvelope =>
	pipe(
		rawOutput.match(editionEnvelopePattern),
		Option.fromNullishOr,
		Option.flatMap((match) => Option.fromUndefinedOr(match[0])),
		Option.match({
			onNone: () => {
				throw new Error(
					"Unable to extract edition result envelope from Flue output.",
				);
			},
			onSome: (jsonText) => decodeEditionEnvelope(JSON.parse(jsonText)),
		}),
	);

const extractEditionResult = (rawOutput: string): EditionResult =>
	pipe(
		extractEditionEnvelope(rawOutput),
		({ result }) => decodeEditionResult(result),
		validateGeneratedEdition,
	);

const toCombinedOutput = ({
	stdout,
	stderr,
}: {
	readonly stdout: string;
	readonly stderr: string;
}) => [stdout, stderr].filter(Boolean).join("\n");

const toPersistedEditionResult = (
	result: EditionResult,
	editionFilePath: string,
): PersistedEditionResult =>
	PersistedEditionResultSchema.make({
		...result,
		filePath: path.relative(repoRoot, editionFilePath),
	});

const writeUtf8 = (filePath: string, contents: string) =>
	Effect.promise(() => fs.writeFile(filePath, contents, "utf8"));

const ensureGeneratedDirectory = Effect.promise(() =>
	fs.mkdir(generatedDirectory, { recursive: true }),
);

const writeGeneratedOutputs = (result: EditionResult, rawOutput: string) => {
	const editionFilePath = path.join(editionDirectory, result.fileName);
	const resultFilePath = path.join(
		generatedDirectory,
		"edition-agent-result.json",
	);
	const outputFilePath = path.join(
		generatedDirectory,
		"edition-agent-output.txt",
	);
	const persistedResult = toPersistedEditionResult(result, editionFilePath);

	return pipe(
		ensureGeneratedDirectory,
		Effect.flatMap(() =>
			Effect.all(
				[
					writeUtf8(editionFilePath, result.mdx),
					writeUtf8(outputFilePath, rawOutput),
					writeUtf8(resultFilePath, JSON.stringify(persistedResult, null, 2)),
				],
				{ concurrency: "unbounded" },
			),
		),
		Effect.as({
			editionFilePath,
			resultFilePath,
			outputFilePath,
			persistedResult,
		}),
	);
};

const runEditionAgent = (payload: string, editionRunId: string) =>
	Effect.tryPromise(() =>
		execFileAsync(
			"bunx",
			[
				"flue",
				"run",
				"edition",
				"--target",
				"node",
				"--id",
				editionRunId,
				"--payload",
				payload,
			],
			{
				cwd: packageRoot,
				env: process.env,
				maxBuffer: 20 * 1024 * 1024,
			},
		),
	);

const program = Effect.gen(function* () {
	const payload = JSON.stringify(buildPayload());
	const editionRunId = buildEditionRunId();
	const commandOutput = yield* runEditionAgent(payload, editionRunId);
	const combinedOutput = toCombinedOutput(commandOutput);
	const result = extractEditionResult(combinedOutput);
	const files = yield* writeGeneratedOutputs(result, combinedOutput);

	yield* Effect.sync(() => {
		console.log(JSON.stringify(files.persistedResult, null, 2));
		console.error(`Generated edition file: ${files.editionFilePath}`);
	});
});

await Effect.runPromise(program);

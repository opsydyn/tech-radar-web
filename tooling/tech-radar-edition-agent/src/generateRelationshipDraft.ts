import { execFile } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import * as v from "valibot";
import {
	assertEditionSnapshotExists,
	confidenceLevels,
	relationshipTypes,
} from "./relationshipDraft";

const execFileAsync = promisify(execFile);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDirectory, "..");
const repoRoot = path.resolve(currentDirectory, "../../..");
const generatedDirectory = path.join(packageRoot, ".generated");
const reviewFilePath = path.join(generatedDirectory, "related-blips-review.md");
const resultFilePath = path.join(
	generatedDirectory,
	"related-blips-draft-result.json",
);
const outputFilePath = path.join(
	generatedDirectory,
	"relationship-agent-output.txt",
);

const relationshipEnvelopePattern =
	/\{\s*"kind":\s*"RelatedBlipsDraftResult"[\s\S]*?\n\}(?=\n\[flue\] Done\.|\s*$)/m;

const proposalSchema = v.object({
	sourceBlipId: v.string(),
	targetBlipId: v.string(),
	relationshipType: v.picklist(relationshipTypes),
	reason: v.string(),
	context: v.optional(v.string()),
	bidirectional: v.boolean(),
	confidence: v.picklist(confidenceLevels),
	evidence: v.array(v.string()),
});

const skippedProposalSchema = v.object({
	sourceBlipId: v.string(),
	targetBlipId: v.string(),
	relationshipType: v.picklist(relationshipTypes),
	reason: v.string(),
	context: v.optional(v.string()),
	bidirectional: v.boolean(),
	confidence: v.picklist(confidenceLevels),
	evidence: v.array(v.string()),
	skipReason: v.picklist([
		"self-relationship",
		"source-not-active",
		"target-not-active",
		"duplicate-relationship",
		"low-confidence",
		"max-per-source",
		"bidirectional-owned-by-target",
	]),
});

const resultSchema = v.object({
	editionId: v.string(),
	editionTitle: v.string(),
	editionDate: v.string(),
	proposalCount: v.number(),
	skippedProposalCount: v.number(),
	changedFileCount: v.number(),
	changedFiles: v.array(v.string()),
	acceptedProposals: v.array(proposalSchema),
	skippedProposals: v.array(skippedProposalSchema),
	review: v.object({
		overview: v.string(),
		highlights: v.array(v.string()),
		cautions: v.array(v.string()),
	}),
	reviewMarkdown: v.string(),
	files: v.array(
		v.object({
			path: v.string(),
			content: v.string(),
		}),
	),
});

const envelopeSchema = v.object({
	kind: v.literal("RelatedBlipsDraftResult"),
	result: resultSchema,
});

const requireEditionId = (): string => {
	const editionId = process.env.EDITION_ID?.trim();

	if (!editionId) {
		throw new Error(
			"EDITION_ID must be set before running the relationship draft generator.",
		);
	}

	return editionId;
};

const buildPayload = (editionId: string) => {
	const maxRelationshipsPerBlip = process.env.MAX_RELATIONSHIPS_PER_BLIP;

	return {
		editionId,
		...(process.env.RELATIONSHIP_MODEL?.trim()
			? { model: process.env.RELATIONSHIP_MODEL.trim() }
			: {}),
		...(process.env.MINIMUM_CONFIDENCE?.trim()
			? { minimumConfidence: process.env.MINIMUM_CONFIDENCE.trim() }
			: {}),
		...(maxRelationshipsPerBlip && /^\d+$/.test(maxRelationshipsPerBlip)
			? { maxRelationshipsPerBlip: Number(maxRelationshipsPerBlip) }
			: {}),
	};
};

const buildRelationshipRunId = () =>
	process.env.RELATIONSHIP_RUN_ID ?? `related-blips-${Date.now()}`;

const toCombinedOutput = ({
	stdout,
	stderr,
}: {
	readonly stdout: string;
	readonly stderr: string;
}) => [stdout, stderr].filter(Boolean).join("\n");

const extractRelationshipDraft = (rawOutput: string) => {
	const jsonText = rawOutput.match(relationshipEnvelopePattern)?.[0];

	if (!jsonText) {
		throw new Error(
			"Unable to extract related blips draft result envelope from Flue output.",
		);
	}

	const parsed = JSON.parse(jsonText);
	const envelope = v.parse(envelopeSchema, parsed);

	return envelope.result;
};

const ensureGeneratedDirectory = async () => {
	await fs.mkdir(generatedDirectory, { recursive: true });
};

const writeChangedFiles = async (
	files: v.InferOutput<typeof resultSchema>["files"],
) => {
	await Promise.all(
		files.map((file) =>
			fs.writeFile(path.join(repoRoot, file.path), file.content, "utf8"),
		),
	);
};

const runRelationshipAgent = async (payload: string, runId: string) =>
	execFileAsync(
		"bunx",
		[
			"flue",
			"run",
			"relationships",
			"--target",
			"node",
			"--id",
			runId,
			"--payload",
			payload,
		],
		{
			cwd: packageRoot,
			env: process.env,
			maxBuffer: 20 * 1024 * 1024,
		},
	);

const program = async () => {
	const editionId = requireEditionId();
	await assertEditionSnapshotExists(repoRoot, editionId);
	const payload = JSON.stringify(buildPayload(editionId));
	const relationshipRunId = buildRelationshipRunId();
	const commandOutput = await runRelationshipAgent(payload, relationshipRunId);
	const combinedOutput = toCombinedOutput(commandOutput);
	const result = extractRelationshipDraft(combinedOutput);

	await ensureGeneratedDirectory();
	await writeChangedFiles(result.files);
	await Promise.all([
		fs.writeFile(resultFilePath, JSON.stringify(result, null, 2), "utf8"),
		fs.writeFile(reviewFilePath, result.reviewMarkdown, "utf8"),
		fs.writeFile(outputFilePath, combinedOutput, "utf8"),
	]);

	console.log(
		JSON.stringify(
			{
				editionId: result.editionId,
				editionTitle: result.editionTitle,
				proposalCount: result.proposalCount,
				changedFileCount: result.changedFileCount,
				skippedProposalCount: result.skippedProposalCount,
			},
			null,
			2,
		),
	);
	console.error(`Related blips review: ${reviewFilePath}`);
};

await program();

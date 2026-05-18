import { useStore } from "@nanostores/react";
import { Binary } from "pixelarticons/react/Binary";
import { Server } from "pixelarticons/react/Server";
import { Sparkles } from "pixelarticons/react/Sparkles";
import { ToolCase } from "pixelarticons/react/ToolCase";
import { selectedEdition } from "~components/radar/editionSelectionState";
import { getEditionIdentity } from "~utils/editionHelpers";
import { getQuadrantPath, type QuadrantRouteKey } from "~utils/quadrantRouting";
import * as styles from "./RadarSidebar.css";

const quadrantLinks: ReadonlyArray<{
	readonly key: QuadrantRouteKey;
	readonly label: string;
	readonly Icon: typeof Server;
	readonly toneClassName: string;
}> = [
	{
		key: "platforms",
		label: "Platforms",
		Icon: Server,
		toneClassName: styles.navCardTone.platforms,
	},
	{
		key: "languages-frameworks",
		label: "Languages",
		Icon: Binary,
		toneClassName: styles.navCardTone.languages,
	},
	{
		key: "tools",
		label: "Tools",
		Icon: ToolCase,
		toneClassName: styles.navCardTone.tools,
	},
	{
		key: "techniques",
		label: "Techniques",
		Icon: Sparkles,
		toneClassName: styles.navCardTone.techniques,
	},
] as const;

export const RadarSidebarQuadrantLinks = () => {
	const currentEdition = useStore(selectedEdition);
	const currentEditionId = currentEdition
		? getEditionIdentity(currentEdition)
		: undefined;

	return (
		<div className={styles.navList}>
			{quadrantLinks.map(({ Icon, key, label, toneClassName }) => (
				<a
					key={key}
					href={getQuadrantPath(
						key,
						currentEditionId ? { editionId: currentEditionId } : undefined,
					)}
					className={`${styles.navCard} ${toneClassName}`}
				>
					<span className={styles.navIconWrap}>
						<Icon className={styles.navIcon} aria-hidden="true" />
					</span>
					<span className={styles.navCopy}>
						<span className={styles.navTitle}>{label}</span>
					</span>
				</a>
			))}
		</div>
	);
};

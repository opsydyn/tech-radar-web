import { Popover } from "@base-ui/react/popover";
import { ArrowLeftBox } from "pixelarticons/react/ArrowLeftBox";
import { ArrowRightBox } from "pixelarticons/react/ArrowRightBox";
import { ArrowsHorizontal } from "pixelarticons/react/ArrowsHorizontal";
import { CornerUpRight } from "pixelarticons/react/CornerUpRight";
import { Globe } from "pixelarticons/react/Globe";
import { InfoBox } from "pixelarticons/react/InfoBox";
import { Link } from "pixelarticons/react/Link";
import { Shuffle } from "pixelarticons/react/Shuffle";
import type { ComponentType, SVGProps } from "react";
import type { RelationshipType } from "../types/radar-types";
import * as styles from "./RelationshipTypesTooltip.css";

type PixelartIcon = ComponentType<SVGProps<SVGSVGElement>>;

type RelationshipDefinition = {
	readonly type: RelationshipType;
	readonly title: string;
	readonly description: string;
	readonly Icon: PixelartIcon;
};

const iconProps = {
	"aria-hidden": true,
	height: 16,
	width: 16,
} as const;

const relationshipDefinitions = [
	{
		type: "prerequisite",
		title: "Prerequisite",
		description: "Technologies you should know first",
		Icon: ArrowLeftBox,
	},
	{
		type: "complement",
		title: "Complement",
		description: "Technologies that work well together",
		Icon: Link,
	},
	{
		type: "evolution",
		title: "Evolution",
		description: "Natural progression or upgrade path",
		Icon: CornerUpRight,
	},
	{
		type: "alternative",
		title: "Alternative",
		description: "Different options solving similar problems",
		Icon: Shuffle,
	},
	{
		type: "comparison",
		title: "Comparison",
		description: "Technologies often compared or evaluated together",
		Icon: ArrowsHorizontal,
	},
	{
		type: "migration",
		title: "Migration",
		description: "Migration path from one technology to another",
		Icon: ArrowRightBox,
	},
	{
		type: "ecosystem",
		title: "Ecosystem",
		description: "Part of the same technology ecosystem",
		Icon: Globe,
	},
] as const satisfies readonly RelationshipDefinition[];

const PopoverArrow = () => (
	<svg aria-hidden="true" viewBox="0 0 12 6" width="12" height="6">
		<path d="M0 6 6 0l6 6" fill="currentColor" />
	</svg>
);

const RelationshipTypesTooltip = () => {
	return (
		<Popover.Root>
			<Popover.Trigger
				className={styles.trigger}
				openOnHover
				delay={150}
				aria-label="Learn about relationship types"
				title="Learn about relationship types"
			>
				<InfoBox {...iconProps} />
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Positioner
					className={styles.positioner}
					side="top"
					align="start"
					sideOffset={10}
				>
					<Popover.Popup className={styles.popup}>
						<Popover.Arrow className={styles.arrow}>
							<PopoverArrow />
						</Popover.Arrow>
						<Popover.Title className={styles.title}>
							Relationship Types
						</Popover.Title>
						<Popover.Description className={styles.description}>
							How related technologies connect across the radar.
						</Popover.Description>
						<div className={styles.list}>
							{relationshipDefinitions.map(({ Icon, ...relationship }) => (
								<div className={styles.row} key={relationship.type}>
									<div className={styles.icon}>
										<Icon {...iconProps} />
									</div>
									<div>
										<p className={styles.itemTitle}>{relationship.title}</p>
										<p className={styles.itemDescription}>
											{relationship.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default RelationshipTypesTooltip;

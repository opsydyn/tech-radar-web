import { Drawer } from "@base-ui/react/drawer";
import { useStore } from "@nanostores/react";
import { Binary } from "pixelarticons/react/Binary";
import { Cancel } from "pixelarticons/react/Cancel";
import { ChevronRight2 } from "pixelarticons/react/ChevronRight2";
import { Server } from "pixelarticons/react/Server";
import { Sparkles } from "pixelarticons/react/Sparkles";
import { ToolCase } from "pixelarticons/react/ToolCase";
import { type ComponentType, type SVGProps, useEffect } from "react";
import { EditionSwitcher } from "~components/radar/EditionSwitcher";
import { animationEnabled } from "~stores/animation-store";
import type { Edition } from "~utils/editionHelpers";
import { withBasePath } from "~utils/sitePaths";
import * as styles from "./RadarSidebar.css";
import {
	type RadarAdrFilter,
	radarAdrFilter,
	setRadarAdrFilter,
} from "./radarSearchStore";

type RadarSidebarProps = {
	editions: Edition[];
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
};

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

type QuadrantLink = {
	label: string;
	href: string;
	tone: "platforms" | "languages" | "tools" | "techniques";
	Icon: SidebarIcon;
};

const quadrantLinks: readonly QuadrantLink[] = [
	{
		label: "Platforms",
		href: withBasePath("/quadrants/platforms"),
		tone: "platforms",
		Icon: Server,
	},
	{
		label: "Languages",
		href: withBasePath("/quadrants/languages-frameworks"),
		tone: "languages",
		Icon: Binary,
	},
	{
		label: "Tools",
		href: withBasePath("/quadrants/tools"),
		tone: "tools",
		Icon: ToolCase,
	},
	{
		label: "Techniques",
		href: withBasePath("/quadrants/techniques"),
		tone: "techniques",
		Icon: Sparkles,
	},
] as const;

const adrFilterOptions: readonly { label: string; value: RadarAdrFilter }[] = [
	{ label: "All", value: "all" },
	{ label: "Has ADR", value: "has-adr" },
	{ label: "No ADR", value: "no-adr" },
] as const;

export const RadarSidebar = ({
	editions,
	isOpen,
	onOpenChange,
}: RadarSidebarProps) => {
	const isRadarEnabled = useStore(animationEnabled);
	const adrFilter = useStore(radarAdrFilter);

	useEffect(() => {
		const htmlElement = document.documentElement;

		if (isRadarEnabled) {
			htmlElement.classList.remove("animations-disabled");
			htmlElement.classList.add("animations-enabled");
			return;
		}

		htmlElement.classList.add("animations-disabled");
		htmlElement.classList.remove("animations-enabled");
	}, [isRadarEnabled]);

	const handleRadarToggle = () => {
		animationEnabled.set(!animationEnabled.get());
	};

	return (
		<>
			<button
				type="button"
				className={styles.collapsedTrigger}
				data-open={isOpen ? "true" : undefined}
				onClick={() => onOpenChange(true)}
				aria-label="Open radar controls"
			>
				<ChevronRight2
					className={styles.collapsedTriggerIcon}
					aria-hidden="true"
				/>
			</button>

			<Drawer.Root
				open={isOpen}
				onOpenChange={onOpenChange}
				swipeDirection="left"
				modal={false}
				disablePointerDismissal
			>
				<Drawer.SwipeArea className={styles.swipeArea} />
				<Drawer.Portal keepMounted>
					<Drawer.Viewport className={styles.viewport}>
						<Drawer.Popup
							className={styles.popup}
							initialFocus={false}
							finalFocus={false}
						>
							<Drawer.Content className={styles.surface}>
								<Drawer.Title className={styles.visuallyHidden}>
									Radar controls
								</Drawer.Title>
								<Drawer.Close
									className={styles.closeButton}
									aria-label="Collapse radar controls"
									data-base-ui-swipe-ignore=""
									onClick={() => onOpenChange(false)}
								>
									<Cancel className={styles.closeIcon} aria-hidden="true" />
								</Drawer.Close>
								<div className={styles.content}>
									<section
										className={styles.section}
										data-base-ui-swipe-ignore=""
									>
										<div className={styles.sectionHeading}>Edition</div>
										<EditionSwitcher editions={editions} />
										<label className={styles.sidebarFilterField}>
											<span className={styles.sidebarFilterLabel}>ADR</span>
											<select
												className={styles.sidebarFilterSelect}
												value={adrFilter}
												onChange={(event) =>
													setRadarAdrFilter(
														event.target.value as RadarAdrFilter,
													)
												}
												aria-label="Filter blips by ADR availability"
											>
												{adrFilterOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</label>
									</section>

									<section className={styles.section}>
										<div className={styles.sectionHeading}>Quadrants</div>
										<div className={styles.navList}>
											{quadrantLinks.map(({ Icon, href, label, tone }) => (
												<a
													key={href}
													href={href}
													className={`${styles.navCard} ${styles.navCardTone[tone]}`}
												>
													<span className={styles.navIconWrap}>
														<Icon
															className={styles.navIcon}
															aria-hidden="true"
														/>
													</span>
													<span className={styles.navCopy}>
														<span className={styles.navTitle}>{label}</span>
													</span>
												</a>
											))}
										</div>
									</section>

									<section
										className={styles.radarSection}
										data-base-ui-swipe-ignore=""
									>
										<div className={styles.sectionHeading}>Radar</div>
										<button
											type="button"
											className={styles.radarToggleButton}
											onClick={handleRadarToggle}
											data-base-ui-swipe-ignore=""
										>
											Radar: {isRadarEnabled ? "ON" : "OFF"}
										</button>
									</section>
								</div>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	);
};

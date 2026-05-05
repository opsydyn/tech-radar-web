import { Drawer } from "@base-ui/react/drawer";
import { useState } from "react";
import * as styles from "./MessageDrawer.css";
import TechRadarTable from "./table/TechRadarTable";
import type { Blip } from "./table/types";

type MessageDrawerProps = {
	blips: Blip[];
};

/**
 * MessageDrawer component using Base UI for a bottom drawer containing the Tech Radar table
 */
const MessageDrawer = ({ blips }: MessageDrawerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Drawer.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			modal={false}
			disablePointerDismissal
		>
			<Drawer.Trigger
				className={styles.trigger}
				aria-label="Open tech radar table"
				title="Open tech radar table"
			>
				<span aria-hidden="true" className={styles.triggerBar} />
			</Drawer.Trigger>

			<Drawer.Portal>
				<Drawer.Viewport className={styles.viewport}>
					<Drawer.Popup className={styles.popup}>
						<div className={styles.handle} aria-hidden="true" />
						<Drawer.Content>
							<Drawer.Title className={styles.visuallyHidden}>
								Tech Radar Table
							</Drawer.Title>
							<Drawer.Description className={styles.visuallyHidden}>
								Browse and filter the tech radar as a bottom drawer.
							</Drawer.Description>

							<div className={styles.titleBar}>
								<h2 className={styles.title}>Tech Radar Table</h2>
								<Drawer.Close className={styles.closeButton}>
									Collapse
								</Drawer.Close>
							</div>

							<div className={styles.scrollRegion} data-base-ui-swipe-ignore>
								<div className={styles.tableContainer}>
									<TechRadarTable blips={blips} />
								</div>
							</div>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

export default MessageDrawer;

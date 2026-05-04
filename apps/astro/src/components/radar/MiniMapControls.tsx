import { useStore } from "@nanostores/react";
import { miniMapState, toggleMiniMap } from "~stores/radar-store";

import * as styles from "./Radar.css";

export const MiniMapControls = () => {
  const miniMapstate = useStore(miniMapState);

  return (
    <div className={styles.miniMap}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLg}`}
        onClick={toggleMiniMap}
      >
        {miniMapstate.showMiniMap ? "Hide" : "Show"} Mini Map
      </button>
    </div>
  );
};

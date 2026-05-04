import { useStore } from "@nanostores/react";
import type { ProvidedZoom, TransformMatrix } from "@visx/zoom/lib/types";
import { miniMapState, toggleMiniMap } from "~stores/radar-store";
import { getEffectiveTheme } from "~stores/theme-store";

import * as styles from "./Radar.css";
import { gapLevel5 } from "~styles/vertical-rhythm.css";

declare type ZoomState = {
  initialTransformMatrix: TransformMatrix;
  transformMatrix: TransformMatrix;
  isDragging: boolean;
};

type Zoom = ProvidedZoom<SVGSVGElement> & ZoomState;

export const RadarControls = ({ zoom }: { zoom: Zoom }) => {
  const effectiveTheme = getEffectiveTheme();
  const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';
  
  return (
    <div className={`${styles.controls} ${gapLevel5}`}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnZoom} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
      >
        +
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnZoom} ${styles.btnBottom} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
      >
        -
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLg} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={zoom.center}
      >
        Center
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLg} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={zoom.reset}
      >
        Reset
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLg} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={zoom.clear}
      >
        Clear
      </button>
    </div>
  );
};

export const MiniMapControls = () => {
  const miniMapstate = useStore(miniMapState);
  const effectiveTheme = getEffectiveTheme();
  const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';

  return (
    <div className={`${styles.miniMap} ${gapLevel5}`}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLg} ${isDarkTheme ? styles.btnDark : styles.btnLight}`}
        onClick={toggleMiniMap}
      >
        {miniMapstate.showMiniMap ? "Hide" : "Show"} Mini Map
      </button>
    </div>
  );
};

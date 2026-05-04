import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import type { ScaleType } from "@observablehq/plot";

type Data = Array<Record<string, string | number>>;

type ObservablePlotProps = {
  data: Data;
  xKey: string;
  yKey: string;
  fillKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
  width: number;
  colourType: ScaleType;
};

const ObservablePlot = ({
  data,
  xKey = "defaultXKey",
  yKey = "defaultYKey",
  fillKey = "defaultFillKey",
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  width = 600,
  colourType = "categorical",
}: ObservablePlotProps) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentPlotRef = plotRef.current;
    const plot = Plot.plot({
      x: {
        grid: true,
        label: xAxisLabel,
      },
      y: {
        grid: true,
        label: yAxisLabel,
      },
      color: {
        type: colourType,
      },
      marks: [
        Plot.barY(data, { x: xKey, y: yKey, fill: fillKey }),
        Plot.ruleY([0]),
      ],
      width,
    });

    currentPlotRef?.appendChild(plot);
    return () => {
      if (currentPlotRef?.firstChild) {
        currentPlotRef?.removeChild(currentPlotRef?.firstChild);
      }
    };
  }, [data, xKey, yKey, fillKey, xAxisLabel, yAxisLabel, width, colourType]);

  return <div ref={plotRef}></div>;
};

export default ObservablePlot;

import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import type { SeriesPoint } from '@visx/shape/lib/types';
import { Text } from '@visx/text';
import { Tooltip, defaultStyles, withTooltip } from '@visx/tooltip';
import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { useEffect, useState } from 'react';

type MoveType = "grow" | "go" | "stay";
type MoveTuple = [MoveType, string];

type BlipHistoryData = {
  date: string;
  grow: number;
  go: number;
  stay: number;
};


export type BlipHistoryProps = {
  width: number;
  height: number;
  moveHistory: Array<MoveTuple>;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};


type TooltipData = {
  key: MoveType;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
  data: BlipHistoryData;
  date: string;
  actualDate: string;
};


// Light theme colors
const lightColors = {
  grow: '#36cf57',
  go: '#e91e63',
  stay: '#71e3e2',
};

// Dark theme colors - brighter for better visibility on dark backgrounds
const darkColors = {
  grow: '#4CAF50',
  go: '#FF5252',
  stay: '#64FFDA',
};

const defaultMargin = { top: 40, left: 50, right: 40, bottom: 100 };

// Light theme tooltip
const lightTooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

// Dark theme tooltip
const darkTooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(255,255,255,0.9)',
  color: 'black',
};

const keys = Object.keys(lightColors) as MoveType[];

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

const transformMoveHistoryToChartData = (moveHistory: MoveTuple[]): [BlipHistoryData[], string[]] => {
  const sortedHistory = [...moveHistory].sort((a, b) =>
    new Date(a[1]).getTime() - new Date(b[1]).getTime()
  );

  const chartData = sortedHistory.map(([moveType, dateStr]) => {
    const formattedDate = formatDate(dateStr);

    const data: BlipHistoryData = {
      date: formattedDate,
      grow: 0,
      go: 0,
      stay: 0,
    };

    data[moveType] = 1;

    return data;
  });

  const originalDates = sortedHistory.map(([_, dateStr]) => dateStr);

  return [chartData, originalDates];
};

const BlipHistory = withTooltip<BlipHistoryProps, TooltipData>(
  ({
    width,
    height,
    moveHistory,
    margin = defaultMargin,
    events = false,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }: BlipHistoryProps & WithTooltipProvidedProps<TooltipData>) => {
    // Track the current theme
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Check for theme on mount and listen for changes
    useEffect(() => {
      // Initial theme check
      const checkTheme = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        setIsDarkTheme(theme === 'dark');
      };

      checkTheme();

      // Listen for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            checkTheme();
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });

      return () => observer.disconnect();
    }, []);

    // Use appropriate colors based on theme
    const colors = isDarkTheme ? darkColors : lightColors;
    const tooltipStyles = isDarkTheme ? darkTooltipStyles : lightTooltipStyles;

    // Theme-specific styles
    const themeStyles = {
      background: isDarkTheme ? '#333333' : '#f9f9f9',
      text: isDarkTheme ? '#ffffff' : '#333333',
      emptyText: isDarkTheme ? '#aaaaaa' : '#666666',
      axisStroke: isDarkTheme ? '#888888' : '#333333',
    };
    const [data, originalDates] = transformMoveHistoryToChartData(moveHistory);

    if (data.length === 0) {
      return (
        <div style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: themeStyles.background,
          borderRadius: '14px',
          color: themeStyles.emptyText
        }}>
          No movement history available
        </div>
      );
    }

    // Bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;


    const dateScale = scaleBand<string>({
      domain: data.map(d => d.date),
      padding: 0.2,
    });

    const moveScale = scaleLinear<number>({
      domain: [0, 1],
    });

    const colorScale = scaleOrdinal<MoveType, string>({
      domain: keys,
      range: keys.map(key => colors[key]),
    });


    dateScale.rangeRound([0, xMax]);
    moveScale.range([yMax, 0]);

    return (
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height}>
          <rect width={width} height={height} fill={themeStyles.background} rx={14} />
          <Group left={margin.left} top={margin.top}>
            <BarStack<BlipHistoryData, MoveType>
              data={data}
              keys={keys}
              x={d => d.date}
              xScale={dateScale}
              yScale={moveScale}
              color={colorScale}
            >
              {barStacks =>
                barStacks.map(barStack =>
                  barStack.bars.map(bar => (
                    <rect
                      key={`bar-stack-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                      onClick={() => {
                        if (events) {
                          alert(JSON.stringify({
                            key: bar.key,
                            date: originalDates[barStack.index]
                          }));
                        }
                      }}
                      onMouseLeave={() => {
                        hideTooltip();
                      }}
                      onMouseMove={() => {
                        const top = bar.y + margin.top;
                        const left = bar.x + bar.width / 2 + margin.left;

                        const tooltipData: TooltipData = {
                          key: bar.key,
                          index: bar.index,
                          height: bar.height,
                          width: bar.width,
                          x: bar.x,
                          y: bar.y,
                          color: bar.color,
                          data: data[barStack.index],
                          date: data[barStack.index].date,
                          actualDate: originalDates[barStack.index]
                        };

                        showTooltip({
                          tooltipData,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  )),
                )
              }
            </BarStack>

            <AxisBottom
              top={yMax}
              scale={dateScale}
              tickFormat={(date: string) => date}
              stroke={themeStyles.axisStroke}
              tickStroke={themeStyles.axisStroke}
              tickLabelProps={() => ({
                fill: themeStyles.text,
                fontSize: 12,
                textAnchor: 'middle',
              })}
            />

            {/* Y-axis */}
            {/* <AxisLeft
              scale={moveScale}
              stroke="#333"
              tickStroke="#333"
              tickValues={[0, 0.5, 1]}
              tickFormat={(value: number) => value === 1 ? 1 : value === 0 ? 0 : 0.5}
              tickLabelProps={() => ({
                fill: '#333',
                fontSize: 12,
                textAnchor: 'end',
                dy: '0.33em',
              })}
            /> */}

            <Text
              x={xMax / 2}
              y={-20}
              textAnchor="middle"
              fontSize={16}
              fontWeight="bold"
              fill={themeStyles.text}
            >
              Movement History
            </Text>
          </Group>
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          <div style={{ color: themeStyles.text }}>
            <LegendOrdinal
              scale={colorScale}
              direction="row"
              labelMargin="0 15px 0 0"
              shape="circle"
              style={{ display: 'flex', alignItems: 'center' }}
              labelFormat={label =>
                label === 'grow' ? 'Moved In' :
                  label === 'go' ? 'Moved Out' : 'Stayed'
              }
            />
          </div>
        </div>

        {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <div>
              <strong>{tooltipData.date}</strong>
            </div>
            <div style={{ color: colorScale(tooltipData.key) }}>
              {tooltipData.key === 'grow' ? 'Moved In' :
                tooltipData.key === 'go' ? 'Moved Out' : 'Stayed'}
            </div>
            <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
              {tooltipData.actualDate}
            </div>
          </Tooltip>
        )}
      </div>
    );
  },
);

export default BlipHistory;

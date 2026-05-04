// Wardley Map Component
// Following functional programming patterns from CLAUDE.md with visx hybrid approach

import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { Tooltip, withTooltip } from '@visx/tooltip';
import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { useMachine } from '@xstate/react';
import { Either } from 'effect';
import React, { useMemo, useCallback, useEffect } from 'react';

import * as styles from './WardleyMap.css';
import {
    selectFilterByVisibility,
    selectHoveredComponent,
    selectIsDragging,
    selectLayout,
    selectSelectedComponent,
    selectShowDependencies,
    selectShowEvolutionStages,
    wardleyEvents,
    wardleyMachine
} from './wardley.machine';
import type {
    ComponentId,
    ComponentLayout,
    EvolutionStage,
    VisibilityLevel,
    WardleyLayout,
    WardleyMap as WardleyMapType
} from './wardley.types';
import {
    analyzeEvolutionStage,
    calculateStrategicValue,
    createDefaultMap,
    findComponentAtPosition,
    generateWardleyLayout,
    getComponentDependencies
} from './wardley.utils';

// 🎯 Base component props
type WardleyMapBaseProps = {
    map?: WardleyMapType;
    width?: number;
    height?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    showTooltips?: boolean;
    showLegend?: boolean;
    interactive?: boolean;
    onComponentSelect?: (componentId: ComponentId) => void;
    onComponentHover?: (componentId: ComponentId | null) => void;
    onMapUpdate?: (map: WardleyMapType) => void;
};

// 🎯 Component props with tooltip HOC
type WardleyMapProps = WardleyMapBaseProps & WithTooltipProvidedProps<ComponentLayout>;

// 🎨 Pure component for rendering a single component
const MapComponent = React.memo(({
    component,
    isSelected,
    isHovered,
    isDragging,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onMouseDown
}: {
    component: ComponentLayout;
    isSelected: boolean;
    isHovered: boolean;
    isDragging: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
}) => {
    // Determine component state for styling
    const componentState = isDragging ? 'dragging' : isSelected ? 'selected' : isHovered ? 'hovered' : 'idle';

    return (
        <Group>
            {/* Component circle */}
            <circle
                cx={component.screenX}
                cy={component.screenY}
                r={component.radius}
                className={styles.component({
                    type: component.type,
                    stage: component.stage,
                    state: componentState
                })}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                }}
                onMouseDown={onMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                tabIndex={0}
                role="button"
                aria-label={`Select component ${component.name}`}
            />

            {/* Component label */}
            <Text
                x={component.screenX}
                y={component.screenY - component.radius - 8}
                className={styles.componentLabel}
                textAnchor="middle"
            >
                {component.name}
            </Text>

            {/* Movement indicator */}
            {component.movement && (
                <Text
                    x={component.screenX + component.radius + 8}
                    y={component.screenY - component.radius}
                    className={styles.movementIndicator}
                    textAnchor="start"
                >
                    {component.movement === 'Evolving' ? '→' : component.movement === 'Declining' ? '←' : '●'}
                </Text>
            )}
        </Group>
    );
});

MapComponent.displayName = 'MapComponent';

// 🎨 Pure component for rendering dependencies
const DependencyLines = React.memo(({
    layout,
    showDependencies,
    selectedComponent,
    hoveredComponent
}: {
    layout: WardleyLayout | null;
    showDependencies: boolean;
    selectedComponent: ComponentId | null;
    hoveredComponent: ComponentId | null;
}) => {
    if (!showDependencies || !layout) return null;

    return (
        <Group>
            {layout.dependencies.map((depPath, index: number) => {
                const isHighlighted = selectedComponent === depPath.dependency.from ||
                    selectedComponent === depPath.dependency.to ||
                    hoveredComponent === depPath.dependency.from ||
                    hoveredComponent === depPath.dependency.to;

                const isDimmed = (selectedComponent || hoveredComponent) && !isHighlighted;

                return (
                    <path
                        key={`${depPath.dependency.from}-${depPath.dependency.to}-${index}`}
                        d={depPath.path}
                        className={styles.dependency({
                            type: depPath.dependency.type,
                            state: isHighlighted ? 'highlighted' : isDimmed ? 'dimmed' : 'normal'
                        })}
                    />
                );
            })}
        </Group>
    );
});

DependencyLines.displayName = 'DependencyLines';

// 🎨 Pure component for grid and axes
const MapGrid = React.memo(({
    width,
    height,
    showGrid,
    showEvolutionStages,
    layout
}: {
    width: number;
    height: number;
    showGrid: boolean;
    showEvolutionStages: boolean;
    layout: WardleyLayout | null;
}) => {
    if (!showGrid) return null;

    const xScale = scaleLinear({
        domain: [0, 1],
        range: [60, width - 60],
    });

    const yScale = scaleLinear({
        domain: [0, 1],
        range: [height - 100, 60],
    });

    return (
        <Group>
            {/* Background grid */}
            <GridRows
                scale={yScale}
                width={width - 120}
                left={60}
                height={height - 160}
                top={60}
                className={styles.gridLine}
                numTicks={5}
            />
            <GridColumns
                scale={xScale}
                height={height - 160}
                top={60}
                width={width - 120}
                left={60}
                className={styles.gridLine}
                numTicks={4}
            />

            {/* Evolution stage dividers */}
            {showEvolutionStages && layout?.evolutionAxis.map((stage) => (
                <Group key={stage.stage}>
                    <line
                        x1={stage.position}
                        y1={60}
                        x2={stage.position}
                        y2={height - 100}
                        className={styles.axisDivider}
                    />
                    <Text
                        x={stage.position}
                        y={height - 40}
                        className={styles.evolutionStageLabel}
                        textAnchor="middle"
                    >
                        {stage.label}
                    </Text>
                </Group>
            ))}

            {/* Axis labels */}
            <Text
                x={width / 2}
                y={height - 10}
                className={styles.axisLabel}
                textAnchor="middle"
            >
                Evolution →
            </Text>
            <Text
                x={20}
                y={height / 2}
                className={styles.axisLabel}
                textAnchor="middle"
                transform={`rotate(-90, 20, ${height / 2})`}
            >
                ← Value
            </Text>
        </Group>
    );
});

MapGrid.displayName = 'MapGrid';

// 🎯 Main Wardley Map component
const WardleyMapComponent = ({
    map,
    width = 900,
    height = 600,
    showGrid = true,
    showLabels = true,
    showTooltips = true,
    showLegend = false,
    interactive = true,
    onComponentSelect,
    onComponentHover,
    onMapUpdate,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
}: WardleyMapProps) => {
    // 🎰 XState machine for interactions
    const [state, send] = useMachine(wardleyMachine);

    // 🎯 Use default map if none provided
    const activeMap = useMemo(() => {
        return map || createDefaultMap();
    }, [map]);

    // 📊 Generate layout using pure functions
    const layout = useMemo(() => {
        const updatedMap = { ...activeMap, width, height };
        const layoutResult = generateWardleyLayout(updatedMap);
        return Either.isRight(layoutResult) ? layoutResult.right : null;
    }, [activeMap, width, height]);

    // 🎯 Load map into machine when layout changes
    useEffect(() => {
        if (layout) {
            send(wardleyEvents.loadMap(layout.map));
            send(wardleyEvents.updateLayout(layout));
        }
    }, [layout, send]);

    // 🎯 Selectors for machine state
    const selectedComponent = selectSelectedComponent(state);
    const hoveredComponent = selectHoveredComponent(state);
    const showDependencies = selectShowDependencies(state);
    const showEvolutionStages = selectShowEvolutionStages(state);
    const filterByVisibility = selectFilterByVisibility(state);
    const isDragging = selectIsDragging(state);

    // 🎯 Event handlers using functional patterns
    const handleComponentHover = useCallback((component: ComponentLayout, event: React.MouseEvent) => {
        if (!interactive) return;

        send(wardleyEvents.hoverComponent(component.id, event.clientX, event.clientY));
        onComponentHover?.(component.id);

        if (showTooltips) {
            showTooltip?.({
                tooltipData: component,
                tooltipLeft: event.clientX,
                tooltipTop: event.clientY,
            });
        }
    }, [interactive, send, onComponentHover, showTooltips, showTooltip]);

    const handleComponentLeave = useCallback(() => {
        if (!interactive) return;

        send(wardleyEvents.leaveComponent());
        onComponentHover?.(null);
        hideTooltip?.();
    }, [interactive, send, onComponentHover, hideTooltip]);

    const handleComponentClick = useCallback((componentId: ComponentId) => {
        if (!interactive) return;

        send(wardleyEvents.selectComponent(componentId));
        onComponentSelect?.(componentId);
    }, [interactive, send, onComponentSelect]);

    const handleComponentMouseDown = useCallback((component: ComponentLayout, event: React.MouseEvent) => {
        if (!interactive) return;

        send(wardleyEvents.startDrag(component.id, event.clientX, event.clientY));
    }, [interactive, send]);

    // 🎨 Mouse position tracking for interactions
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!interactive || !layout) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isDragging) {
            send(wardleyEvents.dragComponent(event.clientX, event.clientY));
            return;
        }

        const componentId = findComponentAtPosition(mouseX, mouseY, layout);

        if (componentId && componentId !== hoveredComponent) {
            const component = layout.components.find(c => c.id === componentId);
            if (component) {
                handleComponentHover(component, event);
            }
        } else if (!componentId && hoveredComponent) {
            handleComponentLeave();
        }
    }, [interactive, layout, isDragging, hoveredComponent, send, handleComponentHover, handleComponentLeave]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            send(wardleyEvents.endDrag());
        }
    }, [isDragging, send]);

    // 🎛️ Control handlers
    const handleToggleDependencies = useCallback(() => {
        send(wardleyEvents.toggleDependencies());
    }, [send]);

    const handleToggleEvolutionStages = useCallback(() => {
        send(wardleyEvents.toggleEvolutionStages());
    }, [send]);

    const handleFilterVisibility = useCallback((level: VisibilityLevel | null) => {
        send(wardleyEvents.filterVisibility(level));
    }, [send]);

    const handleResetFilters = useCallback(() => {
        send(wardleyEvents.resetFilters());
    }, [send]);

    // 🚨 Error handling - return null if layout generation failed
    if (!layout) {
        return (
            <div className={styles.container}>
                <div className={styles.title}>Wardley Map</div>
                <div className={styles.subtitle}>
                    Error: Unable to generate map layout. Please check the map data.
                </div>
            </div>
        );
    }

    // 🎨 Filter components based on current filters
    const visibleComponents = useMemo(() => {
        if (!filterByVisibility) return layout.components;
        return layout.components.filter(c => c.visibility === filterByVisibility);
    }, [layout.components, filterByVisibility]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{layout.map.title}</h2>
            <p className={styles.subtitle}>
                Strategic landscape visualization showing component evolution and value flow
            </p>

            {/* Control panel */}
            <div className={styles.controlPanel}>
                <button
                    type="button"
                    className={styles.controlButton({ variant: showDependencies ? 'primary' : 'secondary' })}
                    onClick={handleToggleDependencies}
                >
                    {showDependencies ? 'Hide' : 'Show'} Dependencies
                </button>
                <button
                    type="button"
                    className={styles.controlButton({ variant: showEvolutionStages ? 'primary' : 'secondary' })}
                    onClick={handleToggleEvolutionStages}
                >
                    {showEvolutionStages ? 'Hide' : 'Show'} Evolution Stages
                </button>
                <select
                    className={styles.filterSelect}
                    value={filterByVisibility || ''}
                    onChange={(e) => handleFilterVisibility(e.target.value as VisibilityLevel || null)}
                >
                    <option value="">All Visibility Levels</option>
                    <option value="Visible">User Visible</option>
                    <option value="Internal">Internal</option>
                    <option value="Infrastructure">Infrastructure</option>
                </select>
                <button
                    type="button"
                    className={styles.controlButton({ variant: 'ghost' })}
                    onClick={handleResetFilters}
                >
                    Reset Filters
                </button>
            </div>

            {/* SVG Map */}
            <div className={styles.svgContainer}>
                <svg
                    width={width}
                    height={height}
                    className={styles.svg}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleComponentLeave}
                >
                    <title>Wardley Map: {layout.map.title}</title>

                    {/* Background grid and axes */}
                    <MapGrid
                        width={width}
                        height={height}
                        showGrid={showGrid}
                        showEvolutionStages={showEvolutionStages}
                        layout={layout}
                    />

                    {/* Dependency lines */}
                    <DependencyLines
                        layout={layout}
                        showDependencies={showDependencies}
                        selectedComponent={selectedComponent}
                        hoveredComponent={hoveredComponent}
                    />

                    {/* Components */}
                    <Group>
                        {visibleComponents.map((component) => (
                            <MapComponent
                                key={component.id}
                                component={component}
                                isSelected={selectedComponent === component.id}
                                isHovered={hoveredComponent === component.id}
                                isDragging={isDragging && selectedComponent === component.id}
                                onMouseEnter={() => handleComponentHover(component, {} as React.MouseEvent)}
                                onMouseLeave={handleComponentLeave}
                                onClick={() => handleComponentClick(component.id)}
                                onMouseDown={(e) => handleComponentMouseDown(component, e)}
                            />
                        ))}
                    </Group>
                </svg>
            </div>

            {/* Tooltip */}
            {showTooltips && tooltipData && (
                <Tooltip
                    left={tooltipLeft}
                    top={tooltipTop}
                    className={styles.tooltip}
                >
                    <div className={styles.tooltipTitle}>
                        {tooltipData.name}
                    </div>
                    <div className={styles.tooltipContent}>
                        <strong>Type:</strong> {tooltipData.type}<br />
                        <strong>Stage:</strong> {tooltipData.stage}<br />
                        <strong>Visibility:</strong> {tooltipData.visibility}
                    </div>
                    <div className={styles.tooltipMeta}>
                        Evolution: {Math.round(tooltipData.evolution * 100)}% |
                        Value: {Math.round(tooltipData.value * 100)}%
                    </div>
                </Tooltip>
            )}

            {/* Selected component info panel */}
            {selectedComponent && (
                <div className={styles.infoPanel}>
                    {(() => {
                        const component = layout.components.find(c => c.id === selectedComponent);
                        if (!component) return null;

                        const evolution = analyzeEvolutionStage(component);
                        const strategic = calculateStrategicValue(component);
                        const dependencies = getComponentDependencies(selectedComponent, layout);

                        return (
                            <>
                                <div className={styles.infoPanelTitle}>
                                    {component.name}
                                </div>
                                <div className={styles.infoPanelContent}>
                                    <p><strong>Evolution Stage:</strong> {evolution.stage}</p>
                                    <p><strong>Risk Level:</strong> {evolution.risk}</p>
                                    <p><strong>Strategic Score:</strong> {Math.round(strategic.overallScore * 100)}%</p>
                                    {dependencies.incoming.length > 0 && (
                                        <p><strong>Dependencies:</strong> {dependencies.incoming.length} incoming, {dependencies.outgoing.length} outgoing</p>
                                    )}
                                </div>
                                <div className={styles.controlPanel}>
                                    <button
                                        type="button"
                                        className={styles.controlButton({ variant: 'secondary' })}
                                        onClick={() => send(wardleyEvents.clearSelection())}
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Legend */}
            {showLegend && (
                <div className={styles.legend}>
                    <div className={styles.legendTitle}>Evolution Stages</div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: styles.componentColors.genesis }} />
                        Genesis - Novel & Uncertain
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: styles.componentColors.custom }} />
                        Custom Built - Emerging
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: styles.componentColors.product }} />
                        Product - Stabilizing
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: styles.componentColors.commodity }} />
                        Commodity - Standardized
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎯 Export with tooltip HOC
export const WardleyMapWithTooltip = withTooltip<WardleyMapProps, ComponentLayout>(
    WardleyMapComponent
);

// 🎯 Export standalone component for direct usage
export const WardleyMap = (props: WardleyMapBaseProps) => (
    <WardleyMapComponent
        {...props}
        showTooltip={() => { }}
        hideTooltip={() => { }}
        tooltipData={undefined}
        tooltipLeft={0}
        tooltipTop={0}
        tooltipOpen={false}
        updateTooltip={() => { }}
    />
);

// 🎪 Export component props type for external usage
export type { WardleyMapBaseProps, WardleyMapProps };

// 🎯 Default export
export default WardleyMap;
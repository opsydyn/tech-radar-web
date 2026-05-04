// Cynefin Framework Diagram Component
// Following functional programming patterns from CLAUDE.md with visx hybrid approach

import { RectClipPath } from '@visx/clip-path';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Text } from '@visx/text';
import { Tooltip, withTooltip } from '@visx/tooltip';
import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { useMachine } from '@xstate/react';
import { Either } from 'effect';
import React, { useMemo, useCallback } from 'react';

import * as styles from './CynefinDiagram.css';
import { cynefinEvents, cynefinMachine, selectHoveredDomain, selectInteractionState, selectSelectedDomain } from './cynefin.machine';
import type { CynefinDomain, CynefinLayout, DomainCharacteristics } from './cynefin.types';
import { calculateHoverPosition, generateCynefinLayout, getDomainCharacteristics } from './cynefin.utils';

// 🎯 Base component props
type CynefinDiagramBaseProps = {
    width?: number;
    height?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    showTooltips?: boolean;
    interactive?: boolean;
    onDomainSelect?: (domain: CynefinDomain) => void;
    onDomainHover?: (domain: CynefinDomain | null) => void;
};

// 🎯 Component props with tooltip HOC
type CynefinDiagramProps = CynefinDiagramBaseProps & WithTooltipProvidedProps<DomainCharacteristics>;

// 🎨 Pure component for domain quadrant rendering
const DomainQuadrant = React.memo(({
    domain,
    characteristics,
    isHovered,
    isSelected,
    onMouseEnter,
    onMouseLeave,
    onClick
}: {
    domain: CynefinDomain;
    characteristics: DomainCharacteristics;
    isHovered: boolean;
    isSelected: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}) => {
    const { position, size } = characteristics;

    // Determine quadrant state for styling
    const quadrantState = isSelected ? 'selected' : isHovered ? 'hovered' : 'idle';
    const domainKey = domain.toLowerCase() as keyof typeof styles.domainColors;

    return (
        <Group>
            {/* Domain rectangle */}
            <rect
                x={position.x}
                y={position.y}
                width={size.width}
                height={size.height}
                className={styles.domainQuadrant({ state: quadrantState, domain: domainKey })}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${domain} domain`}
                style={{
                    fill: characteristics.color,
                    cursor: 'pointer',
                }}
            />

            {/* Domain label */}
            <Text
                x={position.x + size.width / 2}
                y={position.y + size.height / 2 - 20}
                className={styles.domainLabel}
                textAnchor="middle"
                verticalAnchor="middle"
            >
                {domain}
            </Text>

            {/* Domain description */}
            <Text
                x={position.x + size.width / 2}
                y={position.y + size.height / 2}
                className={styles.domainDescription}
                textAnchor="middle"
                verticalAnchor="middle"
                width={size.width - 20}
            >
                {characteristics.description}
            </Text>

            {/* Domain approach */}
            <Text
                x={position.x + size.width / 2}
                y={position.y + size.height / 2 + 20}
                className={styles.domainApproach}
                textAnchor="middle"
                verticalAnchor="middle"
                width={size.width - 20}
            >
                {characteristics.approach}
            </Text>
        </Group>
    );
});

DomainQuadrant.displayName = 'DomainQuadrant';

// 🎨 Pure component for grid rendering
const CynefinGrid = React.memo(({ width, height, showGrid }: {
    width: number;
    height: number;
    showGrid: boolean;
}) => {
    if (!showGrid) return null;

    const xScale = scaleLinear({
        domain: [0, width],
        range: [0, width],
    });

    const yScale = scaleLinear({
        domain: [0, height],
        range: [0, height],
    });

    return (
        <Group>
            <GridRows
                scale={yScale}
                width={width}
                height={height}
                stroke="#e0e0e0"
                strokeWidth={1}
                strokeOpacity={0.3}
                numTicks={4}
            />
            <GridColumns
                scale={xScale}
                width={width}
                height={height}
                stroke="#e0e0e0"
                strokeWidth={1}
                strokeOpacity={0.3}
                numTicks={4}
            />

            {/* Center dividing lines */}
            <line
                x1={width / 2}
                y1={0}
                x2={width / 2}
                y2={height}
                stroke="#ccc"
                strokeWidth={2}
                strokeOpacity={0.5}
            />
            <line
                x1={0}
                y1={height / 2}
                x2={width}
                y2={height / 2}
                stroke="#ccc"
                strokeWidth={2}
                strokeOpacity={0.5}
            />
        </Group>
    );
});

CynefinGrid.displayName = 'CynefinGrid';

// 🎨 Pure component for axis labels
const AxisLabels = React.memo(({ width, height }: { width: number; height: number }) => (
    <Group>
        {/* X-axis labels */}
        <Text
            x={width / 4}
            y={height - 10}
            className={styles.domainDescription}
            textAnchor="middle"
            fontSize={12}
            fill="#666"
        >
            Known
        </Text>
        <Text
            x={(width * 3) / 4}
            y={height - 10}
            className={styles.domainDescription}
            textAnchor="middle"
            fontSize={12}
            fill="#666"
        >
            Unknown
        </Text>

        {/* Y-axis labels */}
        <Text
            x={10}
            y={height / 4}
            className={styles.domainDescription}
            textAnchor="start"
            fontSize={12}
            fill="#666"
            transform={`rotate(-90, 10, ${height / 4})`}
        >
            Order
        </Text>
        <Text
            x={10}
            y={(height * 3) / 4}
            className={styles.domainDescription}
            textAnchor="start"
            fontSize={12}
            fill="#666"
            transform={`rotate(-90, 10, ${(height * 3) / 4})`}
        >
            Unorder
        </Text>
    </Group>
));

AxisLabels.displayName = 'AxisLabels';

// 🎯 Main Cynefin Diagram component
const CynefinDiagramComponent = ({
    width = 800,
    height = 600,
    showGrid = true,
    showLabels = true,
    showTooltips = true,
    interactive = true,
    onDomainSelect,
    onDomainHover,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
}: CynefinDiagramProps) => {
    // 🎰 XState machine for interactions
    const [state, send] = useMachine(cynefinMachine);

    // 🎯 Selectors for machine state
    const interactionState = selectInteractionState(state);
    const selectedDomain = selectSelectedDomain(state);
    const hoveredDomain = selectHoveredDomain(state);

    // 📊 Generate layout using pure functions
    const layout = useMemo(() => {
        const layoutResult = generateCynefinLayout(width, height);
        return Either.isRight(layoutResult) ? layoutResult.right : null;
    }, [width, height]);

    // 🎯 Event handlers using functional patterns
    const handleDomainHover = useCallback((domain: CynefinDomain, characteristics: DomainCharacteristics, event: React.MouseEvent) => {
        if (!interactive) return;

        send(cynefinEvents.hoverDomain(domain));
        onDomainHover?.(domain);

        if (showTooltips) {
            showTooltip?.({
                tooltipData: characteristics,
                tooltipLeft: event.clientX,
                tooltipTop: event.clientY,
            });
        }
    }, [interactive, send, onDomainHover, showTooltips, showTooltip]);

    const handleDomainLeave = useCallback(() => {
        if (!interactive) return;

        send(cynefinEvents.leaveDomain());
        onDomainHover?.(null);
        hideTooltip?.();
    }, [interactive, send, onDomainHover, hideTooltip]);

    const handleDomainClick = useCallback((domain: CynefinDomain) => {
        if (!interactive) return;

        send(cynefinEvents.selectDomain(domain));
        onDomainSelect?.(domain);
    }, [interactive, send, onDomainSelect]);

    // 🎨 Mouse position tracking for hover detection
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!interactive || !layout) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const hoveredDomainResult = calculateHoverPosition(mouseX, mouseY, layout);

        if (hoveredDomainResult && hoveredDomainResult !== hoveredDomain) {
            const characteristics = layout.domains.find(d => d.domain === hoveredDomainResult);
            if (characteristics) {
                handleDomainHover(hoveredDomainResult, characteristics, event);
            }
        } else if (!hoveredDomainResult && hoveredDomain) {
            handleDomainLeave();
        }
    }, [interactive, layout, hoveredDomain, handleDomainHover, handleDomainLeave]);

    // 🚨 Error handling - return null if layout generation failed
    if (!layout) {
        return (
            <div className={styles.container}>
                <div className={styles.title}>Cynefin Framework</div>
                <div className={styles.subtitle}>
                    Error: Unable to generate layout. Please check dimensions.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Cynefin Framework</h2>
            <p className={styles.subtitle}>
                A decision-making framework for complexity management
            </p>

            <div className={styles.svgContainer}>
                <svg
                    width={width}
                    height={height}
                    className={styles.svg}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleDomainLeave}
                    role="img"
                    aria-labelledby="cynefin-title"
                >
                    <title id="cynefin-title">Cynefin Framework diagram showing five domains: Clear, Complicated, Complex, Chaotic, and Aporetic</title>
                    {/* Clip path for clean boundaries */}
                    <RectClipPath id="cynefin-clip" width={width} height={height} />

                    {/* Background grid */}
                    <CynefinGrid width={width} height={height} showGrid={showGrid} />

                    {/* Axis labels */}
                    {showLabels && <AxisLabels width={width} height={height} />}

                    {/* Domain quadrants */}
                    <Group clipPath="url(#cynefin-clip)">
                        {layout.domains.map((characteristics) => (
                            <DomainQuadrant
                                key={characteristics.domain}
                                domain={characteristics.domain}
                                characteristics={characteristics}
                                isHovered={hoveredDomain === characteristics.domain}
                                isSelected={selectedDomain === characteristics.domain}
                                onMouseEnter={() => handleDomainHover(characteristics.domain, characteristics, {} as React.MouseEvent)}
                                onMouseLeave={handleDomainLeave}
                                onClick={() => handleDomainClick(characteristics.domain)}
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
                    className={styles.infoPanel}
                >
                    <div className={styles.infoPanelTitle}>
                        {tooltipData.domain}
                    </div>
                    <div className={styles.infoPanelContent}>
                        {tooltipData.description}
                    </div>
                    <div className={styles.infoPanelApproach}>
                        {tooltipData.approach}
                    </div>
                </Tooltip>
            )}

            {/* Selected domain info panel */}
            {selectedDomain && (
                <div className={styles.infoPanel}>
                    <div className={styles.infoPanelTitle}>
                        {selectedDomain}
                    </div>
                    <div className={styles.infoPanelContent}>
                        {(() => {
                            const characteristics = getDomainCharacteristics(selectedDomain);
                            return (
                                <>
                                    <p>{characteristics.description}</p>
                                    <div className={styles.infoPanelApproach}>
                                        <strong>Approach:</strong> {characteristics.approach}
                                    </div>
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <strong>Complexity:</strong> {characteristics.complexity}/10
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                    <div className={styles.controlPanel}>
                        <button
                            type="button"
                            className={styles.controlButton({ variant: 'secondary' })}
                            onClick={() => send(cynefinEvents.clearSelection())}
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎯 Export with tooltip HOC
export const CynefinDiagramWithTooltip = withTooltip<CynefinDiagramProps, DomainCharacteristics>(
    CynefinDiagramComponent
);

// 🎯 Export standalone component for direct usage
export const CynefinDiagram = (props: CynefinDiagramBaseProps) => (
    <CynefinDiagramComponent
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
export type { CynefinDiagramBaseProps, CynefinDiagramProps };

// 🎯 Default export
export default CynefinDiagram;
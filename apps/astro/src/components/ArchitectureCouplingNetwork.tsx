import { Drag } from '@visx/drag';
import { Group } from '@visx/group';
import { Graph } from '@visx/network';
import { Tooltip, defaultStyles, withTooltip } from '@visx/tooltip';
import type { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { Zoom } from '@visx/zoom';
import { type SimulationNodeDatum, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getEffectiveTheme } from '~stores/theme-store';
import { vars } from '~styles/cyberpunk.css';
import type { ArchitectureLayer, CouplingMetric } from '../utils/mockArchitectureData';
import { ARCHITECTURE_COLOR_SCHEMES } from '../utils/mockArchitectureData';
import { linkHoverClass, nodeHoverClass } from './ArchitectureCouplingNetwork.css';

// Types following functional programming patterns
type NetworkProps = {
    readonly data: readonly CouplingMetric[];
    readonly width?: number;
    readonly height?: number;
};

type CouplingType = 'afferent' | 'efferent' | 'bidirectional';

interface NetworkNode extends SimulationNodeDatum {
    readonly id: string;
    readonly radius: number;
    readonly layer: ArchitectureLayer;
    readonly color: string;
}

interface NetworkLink {
    readonly source: NetworkNode;
    readonly target: NetworkNode;
    readonly value: number;
    readonly type: CouplingType;
}

// Add TooltipPosition type
type TooltipPosition = {
    x: number;
    y: number;
} | null;

// Constants
const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };

// Enhanced tooltip data type
type TooltipData = {
    id: string;
    layer: ArchitectureLayer;
    incomingConnections: Array<{ id: string; layer: ArchitectureLayer; type: CouplingType }>;
    outgoingConnections: Array<{ id: string; layer: ArchitectureLayer; type: CouplingType }>;
    bidirectionalConnections: Array<{ id: string; layer: ArchitectureLayer }>;
};

const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: 'white',
    padding: '12px',
    maxWidth: '300px',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(57, 255, 20, 0.2)',
    backdropFilter: 'blur(8px)',
} as const;

// Pure function to get layer from module path
const getModuleLayer = (modulePath: string): ArchitectureLayer => {
    const layerMap: Record<string, ArchitectureLayer> = {
        'components': 'Presentation',
        'pages': 'Presentation',
        'layouts': 'Presentation',
        'services': 'Application',
        'stores': 'Application',
        'hooks': 'Application',
        'types': 'Domain',
        'utils': 'Domain',
        'models': 'Domain',
        'db': 'Infrastructure',
        'mastra': 'Infrastructure',
        'migrations': 'Database',
        'schemas': 'Database',
        'queries': 'Database',
        'integrations': 'External',
        'apis': 'External'
    };

    const firstSegment = modulePath.split('/')[0];
    return layerMap[firstSegment] || 'Domain';
};

// Pure function to transform data for network visualization
const transformToNetworkData = (data: readonly CouplingMetric[]): { nodes: NetworkNode[]; links: NetworkLink[] } => {
    const uniqueModules = new Set<string>();
    for (const metric of data) {
        uniqueModules.add(metric.source_module);
        uniqueModules.add(metric.target_module);
    }

    // Create nodes with fixed initial positions in a circle layout
    const nodes: NetworkNode[] = Array.from(uniqueModules).map((module, index) => {
        const layer = getModuleLayer(module);
        const angle = (index / uniqueModules.size) * 2 * Math.PI;
        const radius = 200; // Adjust this value to change the circle size
        return {
            id: module,
            radius: 8,
            layer,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            color: ARCHITECTURE_COLOR_SCHEMES[layer].bright,
            fx: undefined,
            fy: undefined
        };
    });

    // Create a map for faster node lookups
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // Create links with direct references to nodes
    const links: NetworkLink[] = data.reduce<NetworkLink[]>((acc, metric) => {
        const sourceNode = nodeMap.get(metric.source_module);
        const targetNode = nodeMap.get(metric.target_module);

        if (sourceNode && targetNode) {
            acc.push({
                source: sourceNode,
                target: targetNode,
                value: metric.coupling_strength,
                type: metric.coupling_type
            });
        }
        return acc;
    }, []);

    // Run a gentle initial force simulation to prevent overlap
    const simulation = forceSimulation<NetworkNode>(nodes)
        .force('charge', forceManyBody<NetworkNode>().strength(-50))
        .force('collision', forceCollide<NetworkNode>().radius(30))
        .stop();

    // Run the simulation synchronously just a few times to adjust initial positions
    for (let i = 0; i < 10; ++i) simulation.tick();

    return { nodes, links };
};

// Pure function to get link stroke dash based on type
const getLinkStrokeDash = (type: CouplingType): string => {
    const dashes = {
        afferent: '5,5',
        efferent: '0',
        bidirectional: '10,5'
    };
    return dashes[type];
};

// Pure function to get tooltip data for a node
const getTooltipData = (nodeId: string, nodes: NetworkNode[], links: NetworkLink[]): TooltipData => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
        return {
            id: nodeId,
            layer: 'Domain', // Default layer
            incomingConnections: [],
            outgoingConnections: [],
            bidirectionalConnections: []
        };
    }

    const incomingConnections: TooltipData['incomingConnections'] = [];
    const outgoingConnections: TooltipData['outgoingConnections'] = [];
    const bidirectionalConnections: TooltipData['bidirectionalConnections'] = [];
    const processedNodes = new Set<string>();

    for (const link of links) {
        if (link.source.id === nodeId || link.target.id === nodeId) {
            const otherNode = link.source.id === nodeId ? link.target : link.source;

            if (processedNodes.has(otherNode.id)) continue;
            processedNodes.add(otherNode.id);

            // Check for bidirectional connections
            const hasReverse = links.some(l =>
                (l.source.id === link.target.id && l.target.id === link.source.id) ||
                (l.type === 'bidirectional' &&
                    ((l.source.id === link.source.id && l.target.id === link.target.id) ||
                        (l.source.id === link.target.id && l.target.id === link.source.id)))
            );

            if (hasReverse || link.type === 'bidirectional') {
                bidirectionalConnections.push({
                    id: otherNode.id,
                    layer: otherNode.layer
                });
            } else if (link.source.id === nodeId) {
                outgoingConnections.push({
                    id: otherNode.id,
                    layer: otherNode.layer,
                    type: link.type
                });
            } else {
                incomingConnections.push({
                    id: otherNode.id,
                    layer: otherNode.layer,
                    type: link.type
                });
            }
        }
    }

    return {
        id: node.id,
        layer: node.layer,
        incomingConnections,
        outgoingConnections,
        bidirectionalConnections
    };
};

// Pure function to format module name for display
const formatModuleName = (modulePath: string): string => {
    const parts = modulePath.split('/');
    if (parts.length === 1) return parts[0];
    return `${parts[0]}/.../${parts[parts.length - 1]}`;
};

type TooltipProps = {
    showTooltip: (args: { tooltipData: TooltipData; tooltipLeft: number; tooltipTop: number }) => void;
    hideTooltip: () => void;
    tooltipOpen: boolean;
    tooltipData: TooltipData | undefined;
    tooltipLeft: number;
    tooltipTop: number;
};

const NetworkChart = ({
    data,
    height = 600,
    width = 800,
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop
}: NetworkProps & WithTooltipProvidedProps<TooltipData>) => {
    const effectiveTheme = getEffectiveTheme();
    const isDarkTheme = effectiveTheme === 'dark' || effectiveTheme === 'machine';
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(null);
    const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const [isDragging, setIsDragging] = useState(false);

    // Memoized data transformations with custom positions
    const { nodes, links } = useMemo(() => {
        const result = transformToNetworkData(data);
        // Apply saved positions if they exist
        for (const node of result.nodes) {
            const savedPos = nodePositions.get(node.id);
            if (savedPos) {
                node.x = savedPos.x;
                node.y = savedPos.y;
                // Fix the node position to prevent force layout from moving it
                node.fx = savedPos.x;
                node.fy = savedPos.y;
            } else {
                // Clear any fixed positions if no saved position exists
                node.fx = undefined;
                node.fy = undefined;
            }
        }
        return result;
    }, [data, nodePositions]);

    // Calculate initial transform to center the network
    const initialTransform = useMemo(() => ({
        translateX: width / 2,
        translateY: height / 2,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
    }), [width, height]);

    const handleNodeDragStart = useCallback((nodeId: string) => {
        setIsDragging(true);
        setHoveredNode(nodeId);
    }, []);

    const handleNodeDragMove = useCallback((nodeId: string, dragX: number, dragY: number) => {
        setNodePositions(prev => {
            const newPositions = new Map(prev);
            newPositions.set(nodeId, { x: dragX, y: dragY });
            return newPositions;
        });
    }, []);

    const handleNodeDragEnd = useCallback(() => {
        setIsDragging(false);
        setHoveredNode(null);
    }, []);

    const handleNodeMouseEnter = (node: NetworkNode, event: React.MouseEvent) => {
        const tooltipData = getTooltipData(node.id, nodes, links);
        const rect = event.currentTarget.getBoundingClientRect();
        showTooltip({
            tooltipLeft: rect.x,
            tooltipTop: rect.y,
            tooltipData
        });
        setHoveredNode(node.id);
    };

    // Theme-based styling
    const styles = {
        container: {
            position: 'relative' as const,
            width: '100%',
            height: '100%',
            fontFamily: vars.fonts.mono,
            color: isDarkTheme ? '#ffffff' : '#000000'
        },
        tooltip: {
            position: 'fixed' as const,
            top: tooltipPosition?.y,
            left: tooltipPosition?.x,
            transform: 'translate(10px, -50%)',
            backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDarkTheme ? vars.colors.darkBgAlt : '#e2e8f0'}`,
            borderRadius: '4px',
            padding: '8px',
            fontSize: '12px',
            zIndex: 1000,
            pointerEvents: 'none' as const,
            boxShadow: isDarkTheme
                ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(57, 255, 20, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
    } as const;

    return (
        <div style={{ position: 'relative', width, height }}>
            <Zoom<SVGSVGElement>
                width={width}
                height={height}
                scaleXMin={0.1}
                scaleXMax={4}
                scaleYMin={0.1}
                scaleYMax={4}
                initialTransformMatrix={initialTransform}
            >
                {(zoom) => (
                    <div style={{ position: 'relative', width, height }}>
                        <svg
                            width={width}
                            height={height}
                            style={{
                                cursor: zoom.isDragging ? 'grabbing' : 'grab',
                                touchAction: 'none'
                            }}
                            ref={zoom.containerRef}
                            aria-label="Module coupling network visualization"
                            role="img"
                        >
                            <rect
                                width={width}
                                height={height}
                                fill="transparent"
                                rx={14}
                            />
                            <g transform={zoom.toString()}>
                                {links.map(link => {
                                    const sourcePos = nodePositions.get(link.source.id) || link.source;
                                    const targetPos = nodePositions.get(link.target.id) || link.target;
                                    return (
                                        <line
                                            key={`${link.source.id}-${link.target.id}`}
                                            className={linkHoverClass}
                                            x1={sourcePos.x || 0}
                                            y1={sourcePos.y || 0}
                                            x2={targetPos.x || 0}
                                            y2={targetPos.y || 0}
                                            stroke="#ffffff"
                                            strokeWidth={1 / zoom.transformMatrix.scaleX}
                                            strokeDasharray={getLinkStrokeDash(link.type)}
                                            strokeOpacity={hoveredNode === link.source.id || hoveredNode === link.target.id ? 0.8 : 0.4}
                                        />
                                    );
                                })}
                                {nodes.map(node => {
                                    const nodePos = nodePositions.get(node.id) || node;
                                    return (
                                        <Drag
                                            key={node.id}
                                            width={width}
                                            height={height}
                                            onDragStart={() => handleNodeDragStart(node.id)}
                                            onDragMove={(e) => {
                                                const coords = zoom.applyInverseToPoint({ x: e.x, y: e.y });
                                                handleNodeDragMove(node.id, coords.x, coords.y);
                                            }}
                                            onDragEnd={handleNodeDragEnd}
                                        >
                                            {({ dragStart, dragMove, dragEnd, isDragging }) => (
                                                <circle
                                                    className={nodeHoverClass}
                                                    cx={nodePos.x}
                                                    cy={nodePos.y}
                                                    r={(hoveredNode === node.id ? 12 : 8) / zoom.transformMatrix.scaleX}
                                                    fill={node.color}
                                                    stroke={isDarkTheme ? '#ffffff' : '#000000'}
                                                    strokeWidth={1 / zoom.transformMatrix.scaleX}
                                                    strokeOpacity={0.2}
                                                    style={{
                                                        cursor: isDragging ? 'grabbing' : 'grab',
                                                        filter: isDragging ? 'brightness(1.3)' : undefined
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isDragging) {
                                                            handleNodeMouseEnter(node, e);
                                                        }
                                                    }}
                                                    onMouseMove={(e) => {
                                                        if (!isDragging && hoveredNode === node.id) {
                                                            setTooltipPosition({ x: e.clientX, y: e.clientY });
                                                        }
                                                        dragMove(e);
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (!isDragging) {
                                                            setHoveredNode(null);
                                                            setTooltipPosition(null);
                                                        }
                                                    }}
                                                    onMouseDown={dragStart}
                                                    onMouseUp={dragEnd}
                                                />
                                            )}
                                        </Drag>
                                    );
                                })}
                            </g>
                        </svg>
                        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
                            <button
                                onClick={() => {
                                    zoom.reset();
                                    setNodePositions(new Map());
                                }}
                                type="button"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Reset View
                            </button>
                        </div>
                    </div>
                )}
            </Zoom>
            {tooltipOpen && tooltipData && !isDragging && (
                <Tooltip
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={tooltipStyles}
                >
                    <div>
                        <div style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            paddingBottom: '8px',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: ARCHITECTURE_COLOR_SCHEMES[tooltipData.layer].bright
                            }}>
                                {formatModuleName(tooltipData.id)}
                            </div>
                            <div style={{ opacity: 0.7 }}>
                                {tooltipData.layer} Layer
                            </div>
                        </div>

                        {tooltipData.bidirectionalConnections.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Bidirectional Dependencies ({tooltipData.bidirectionalConnections.length})
                                </div>
                                {tooltipData.bidirectionalConnections.map(conn => (
                                    <div key={conn.id} style={{
                                        marginLeft: '8px',
                                        color: ARCHITECTURE_COLOR_SCHEMES[conn.layer].bright,
                                        opacity: 0.9
                                    }}>
                                        • {formatModuleName(conn.id)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {tooltipData.incomingConnections.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Incoming Dependencies ({tooltipData.incomingConnections.length})
                                </div>
                                {tooltipData.incomingConnections.map(conn => (
                                    <div key={conn.id} style={{
                                        marginLeft: '8px',
                                        color: ARCHITECTURE_COLOR_SCHEMES[conn.layer].bright,
                                        opacity: 0.9
                                    }}>
                                        • {formatModuleName(conn.id)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {tooltipData.outgoingConnections.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Outgoing Dependencies ({tooltipData.outgoingConnections.length})
                                </div>
                                {tooltipData.outgoingConnections.map(conn => (
                                    <div key={conn.id} style={{
                                        marginLeft: '8px',
                                        color: ARCHITECTURE_COLOR_SCHEMES[conn.layer].bright,
                                        opacity: 0.9
                                    }}>
                                        • {formatModuleName(conn.id)}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                            paddingTop: '8px',
                            marginTop: '8px',
                            fontSize: '11px',
                            opacity: 0.7,
                            fontStyle: 'italic'
                        }}>
                            Drag to reposition • Double-click to reset
                        </div>
                    </div>
                </Tooltip>
            )}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '0.5rem',
                borderRadius: '4px'
            }}>
                <strong>Controls:</strong>
                <div style={{ marginTop: '0.25rem', opacity: 0.8 }}>
                    • Scroll to zoom in/out
                    <br />
                    • Drag to pan
                    <br />
                    • Double-click to reset
                    <br />
                    • Drag nodes to reposition
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <span style={{ color: '#ffffff' }}>━━━</span> Afferent Coupling
                    </div>
                    <div>
                        <span style={{ color: '#ffffff' }}>┄┄┄</span> Efferent Coupling
                    </div>
                    <div>
                        <span style={{ color: '#ffffff' }}>━ ━</span> Bidirectional Coupling
                    </div>
                </div>
            </div>
        </div>
    );
};

// Make the chart responsive and add tooltip functionality
export const ArchitectureCouplingNetwork = (props: NetworkProps) => {
    const WrappedChart = withTooltip<NetworkProps, TooltipData>(NetworkChart);
    return <WrappedChart {...props} />;
};

export default ArchitectureCouplingNetwork;
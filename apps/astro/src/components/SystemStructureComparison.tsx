import { Group } from '@visx/group';
import { Text } from '@visx/text';
import React, { useState } from 'react';
import * as styles from './SystemStructureComparison.css';

type NodeType = 'core' | 'generic' | 'supporting';
type ConnectionType = 'intrusive' | 'contract' | 'functional';

interface Node {
    id: string;
    x: number;
    y: number;
    type: NodeType;
}

interface Connection {
    source: string;
    target: string;
    type: ConnectionType;
}

interface SystemProps {
    id: string;
    nodes: Node[];
    connections: Connection[];
    title: string;
    description?: string;
}

const NODE_RADIUS = 30;
const NODE_COLORS: Record<NodeType, string> = {
    core: '#ff5e5b',      // High volatility
    generic: '#b5e853',   // Medium volatility
    supporting: '#5e81ac' // Low volatility
};

const CONNECTION_STYLES: Record<ConnectionType, { stroke: string; strokeWidth: number; strokeDasharray: string }> = {
    intrusive: { stroke: '#ff5e5b', strokeWidth: 3, strokeDasharray: '0' },
    contract: { stroke: '#b5e853', strokeWidth: 2, strokeDasharray: '0' },
    functional: { stroke: '#5e81ac', strokeWidth: 1.5, strokeDasharray: '5,5' }
};

const SystemDiagram: React.FC<SystemProps> = ({ id, nodes, connections, title }) => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

    const width = 500;
    const height = 400;

    // Find a node by ID
    const getNode = (id: string) => nodes.find(n => n.id === id);

    // Generate a unique ID for connections
    const getConnectionId = (source: string, target: string) => `${source}-${target}`;

    // Determine if a connection should be highlighted
    const isConnectionHighlighted = (source: string, target: string) => {
        const connectionId = getConnectionId(source, target);
        return connectionId === hoveredConnection || source === hoveredNode || target === hoveredNode;
    };

    return (
        <div className={styles.systemContainer}>
            <h3 className={styles.systemTitle}>{title}</h3>
            <svg width={width} height={height}>
                <Group>
                    {/* Draw connections */}
                    {connections.map(({ source, target, type }) => {
                        const sourceNode = getNode(source);
                        const targetNode = getNode(target);
                        const connectionId = getConnectionId(source, target);

                        if (!sourceNode || !targetNode) return null;

                        const highlighted = isConnectionHighlighted(source, target);
                        const { stroke, strokeWidth, strokeDasharray } = CONNECTION_STYLES[type];

                        // Calculate control points for curved lines
                        const dx = targetNode.x - sourceNode.x;
                        const dy = targetNode.y - sourceNode.y;
                        const controlX = sourceNode.x + dx / 2;
                        const controlY = sourceNode.y + dy / 2 - 30; // Curve upward

                        return (
                            <g key={connectionId}>
                                <path
                                    d={`M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`}
                                    fill="none"
                                    stroke={stroke}
                                    strokeWidth={highlighted ? strokeWidth + 1 : strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    opacity={highlighted ? 1 : 0.7}
                                    onMouseEnter={() => setHoveredConnection(connectionId)}
                                    onMouseLeave={() => setHoveredConnection(null)}
                                />
                                <Text
                                    x={(sourceNode.x + targetNode.x) / 2}
                                    y={(sourceNode.y + targetNode.y) / 2 - 15}
                                    textAnchor="middle"
                                    fill="#b5e853"
                                    fontSize={12}
                                >
                                    {type}
                                </Text>
                            </g>
                        );
                    })}

                    {/* Draw nodes */}
                    {nodes.map(node => {
                        const isHighlighted = node.id === hoveredNode;

                        return (
                            <g
                                key={node.id}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={NODE_RADIUS}
                                    fill={NODE_COLORS[node.type]}
                                    stroke="#222"
                                    strokeWidth={isHighlighted ? 3 : 1}
                                    opacity={isHighlighted ? 1 : 0.8}
                                />
                                <Text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    verticalAnchor="middle"
                                    fill="#222"
                                    fontWeight="bold"
                                >
                                    {node.id}
                                </Text>
                                <Text
                                    x={node.x}
                                    y={node.y + NODE_RADIUS + 15}
                                    textAnchor="middle"
                                    fill="#b5e853"
                                    fontSize={12}
                                >
                                    {node.type}
                                </Text>
                            </g>
                        );
                    })}
                </Group>
            </svg>
        </div>
    );
};

export const SystemStructureComparison: React.FC = () => {
    // Define System A - Same structure but different volatility and integration types
    const systemANodes: Node[] = [
        { id: 'A', x: 100, y: 100, type: 'supporting' },
        { id: 'B', x: 250, y: 100, type: 'generic' },
        { id: 'C', x: 400, y: 100, type: 'supporting' },
        { id: 'D', x: 100, y: 250, type: 'generic' },
        { id: 'E', x: 250, y: 250, type: 'supporting' },
        { id: 'F', x: 400, y: 250, type: 'supporting' },
    ];

    const systemAConnections: Connection[] = [
        { source: 'A', target: 'B', type: 'functional' },
        { source: 'B', target: 'C', type: 'contract' },
        { source: 'A', target: 'D', type: 'functional' },
        { source: 'B', target: 'E', type: 'contract' },
        { source: 'C', target: 'F', type: 'contract' },
        { source: 'D', target: 'E', type: 'functional' },
        { source: 'E', target: 'F', type: 'contract' },
    ];

    // Define System B - Same structure but with core modules and intrusive connections
    const systemBNodes: Node[] = [
        { id: 'A', x: 100, y: 100, type: 'supporting' },
        { id: 'B', x: 250, y: 100, type: 'core' },
        { id: 'C', x: 400, y: 100, type: 'supporting' },
        { id: 'D', x: 100, y: 250, type: 'generic' },
        { id: 'E', x: 250, y: 250, type: 'core' },
        { id: 'F', x: 400, y: 250, type: 'supporting' },
    ];

    const systemBConnections: Connection[] = [
        { source: 'A', target: 'B', type: 'intrusive' },
        { source: 'B', target: 'C', type: 'contract' },
        { source: 'A', target: 'D', type: 'functional' },
        { source: 'B', target: 'E', type: 'intrusive' },
        { source: 'C', target: 'F', type: 'contract' },
        { source: 'D', target: 'E', type: 'functional' },
        { source: 'E', target: 'F', type: 'contract' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h2>Volatility vs Integration Strength</h2>
                <p>
                    These diagrams show two systems with identical structure but different volatility and integration patterns.
                    System A has stable components with loose coupling, while System B has highly volatile core components
                    with intrusive integration, leading to higher systemic risk.
                </p>
            </div>

            <div className={styles.systemsContainer}>
                <SystemDiagram
                    id="systemA"
                    nodes={systemANodes}
                    connections={systemAConnections}
                    title="System A: Low Risk"
                />
                <SystemDiagram
                    id="systemB"
                    nodes={systemBNodes}
                    connections={systemBConnections}
                    title="System B: High Risk"
                />
            </div>

            <div className={styles.legend}>
                <div className={styles.legendSection}>
                    <h4>Subdomain Types (Volatility)</h4>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: NODE_COLORS.core }}></div>
                        <span>Core: High volatility, high business value</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: NODE_COLORS.generic }}></div>
                        <span>Generic: Low volatility, low complexity</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: NODE_COLORS.supporting }}></div>
                        <span>Supporting: Low volatility, low business value</span>
                    </div>
                </div>

                <div className={styles.legendSection}>
                    <h4>Integration Types (Coupling)</h4>
                    <div className={styles.legendItem}>
                        <div className={styles.legendLine} style={{ backgroundColor: CONNECTION_STYLES.intrusive.stroke }}></div>
                        <span>Intrusive: High coupling, shared state</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendLine} style={{ backgroundColor: CONNECTION_STYLES.contract.stroke }}></div>
                        <span>Contract: Stable interface-based coupling</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendLine} style={{ backgroundColor: CONNECTION_STYLES.functional.stroke }}></div>
                        <span>Functional: Low coupling, event-driven</span>
                    </div>
                </div>
            </div>

            <div className={styles.insights}>
                <h4>Key Insights:</h4>
                <ul>
                    <li>Volatility isn't just about components—it's about how change propagates through their connections</li>
                    <li>System B likely suffers from ripple effects when changing core modules</li>
                    <li>High volatility + intrusive integration = higher systemic risk</li>
                    <li>Target refactoring efforts on high-volatility zones with intrusive integrations</li>
                </ul>
            </div>
        </div>
    );
};

export default SystemStructureComparison;
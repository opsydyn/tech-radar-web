import React from 'react';
import { Group } from '@visx/group';
import { RectClipPath } from '@visx/clip-path';
import { Text } from '@visx/text';

const COLORS = {
    event: '#ff9800', // Orange
    command: '#2196f3', // Blue
    aggregate: '#ffe066', // Yellow
    policy: '#a259e6', // Purple
    actor: '#ff69b4', // Pink
    external: '#4caf50', // Green
    boundary: '#b5e853', // Greenish for boundary
};

const NODES = [
    { id: 'actor', label: 'Actor', type: 'actor', x: 60, y: 180 },
    { id: 'command', label: 'Command', type: 'command', x: 200, y: 180 },
    { id: 'aggregate', label: 'Aggregate', type: 'aggregate', x: 340, y: 180 },
    { id: 'event', label: 'Domain Event', type: 'event', x: 480, y: 120 },
    { id: 'policy', label: 'Policy', type: 'policy', x: 480, y: 240 },
    { id: 'external', label: 'External System', type: 'external', x: 620, y: 180 },
];

const LINKS = [
    { from: 'actor', to: 'command' },
    { from: 'command', to: 'aggregate' },
    { from: 'aggregate', to: 'event' },
    { from: 'event', to: 'policy' },
    { from: 'policy', to: 'command' }, // Feedback loop
    { from: 'aggregate', to: 'external' },
];

const BOUNDED_CONTEXT = {
    x: 180,
    y: 80,
    width: 340,
    height: 220,
};

const LEGEND = [
    { label: 'Domain Event', color: COLORS.event },
    { label: 'Command', color: COLORS.command },
    { label: 'Aggregate', color: COLORS.aggregate },
    { label: 'Policy', color: COLORS.policy },
    { label: 'Actor', color: COLORS.actor },
    { label: 'External System', color: COLORS.external },
    { label: 'Bounded Context', color: COLORS.boundary, border: true },
];

const fontFamily = "'IBM Plex Mono', monospace";

const EventStormingDiagram: React.FC<{ width?: number; height?: number }> = ({ width = 800, height = 350 }) => {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={width} height={height} style={{ background: '#181818', borderRadius: 12, marginBottom: 16 }}>
                <Group>
                    {/* Bounded Context */}
                    <rect
                        x={BOUNDED_CONTEXT.x}
                        y={BOUNDED_CONTEXT.y}
                        width={BOUNDED_CONTEXT.width}
                        height={BOUNDED_CONTEXT.height}
                        fill="none"
                        stroke={COLORS.boundary}
                        strokeWidth={3}
                        rx={18}
                        strokeDasharray="8,6"
                    />
                    <Text
                        x={BOUNDED_CONTEXT.x + BOUNDED_CONTEXT.width / 2}
                        y={BOUNDED_CONTEXT.y - 10}
                        textAnchor="middle"
                        fontSize={16}
                        fontWeight={600}
                        fill={COLORS.boundary}
                        fontFamily={fontFamily}
                    >
                        Bounded Context
                    </Text>
                    {/* Links */}
                    {LINKS.map((link, i) => {
                        const from = NODES.find(n => n.id === link.from)!;
                        const to = NODES.find(n => n.id === link.to)!;
                        return (
                            <line
                                key={i}
                                x1={from.x + 60}
                                y1={from.y + 25}
                                x2={to.x}
                                y2={to.y + 25}
                                stroke="#888"
                                strokeWidth={2}
                                markerEnd="url(#arrow)"
                            />
                        );
                    })}
                    <defs>
                        <marker
                            id="arrow"
                            markerWidth="10"
                            markerHeight="10"
                            refX="10"
                            refY="5"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path d="M0,0 L10,5 L0,10" fill="#888" />
                        </marker>
                    </defs>
                    {/* Nodes */}
                    {NODES.map(node => (
                        <g key={node.id}>
                            <rect
                                x={node.x}
                                y={node.y}
                                width={120}
                                height={50}
                                rx={12}
                                fill={COLORS[node.type as keyof typeof COLORS]}
                                stroke="#222"
                                strokeWidth={2}
                                opacity={node.type === 'aggregate' ? 0.85 : 1}
                            />
                            <Text
                                x={node.x + 60}
                                y={node.y + 28}
                                textAnchor="middle"
                                fontSize={16}
                                fontWeight={600}
                                fill={node.type === 'aggregate' ? '#222' : '#181818'}
                                fontFamily={fontFamily}
                            >
                                {node.label}
                            </Text>
                        </g>
                    ))}
                </Group>
            </svg>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', fontFamily }}>
                {LEGEND.map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{
                            width: 18,
                            height: 18,
                            borderRadius: item.border ? 6 : 4,
                            background: item.border ? 'none' : item.color,
                            border: item.border ? `3px dashed ${item.color}` : 'none',
                            marginRight: 6,
                        }} />
                        <span style={{ color: item.color, fontWeight: 600 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventStormingDiagram;
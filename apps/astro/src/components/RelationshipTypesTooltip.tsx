import {
    Button,
    Title3,
    Tooltip,
} from '@fluentui/react-components';
import {
    ArrowLeftRegular,
    ArrowSyncRegular,
    DataTrendingRegular,
    GlobeRegular,
    InfoRegular,
    LinkSquare20Regular,
    ScalesRegular,
    SearchRegular,
} from '@fluentui/react-icons';
import type React from 'react';
import type { RelationshipType } from '../types/radar-types';

const RelationshipTypesTooltipInner: React.FC = () => {
    const relationshipDefinitions = [
        {
            type: 'prerequisite' as RelationshipType,
            icon: <ArrowLeftRegular />,
            title: 'Prerequisite',
            description: 'Technologies you should know first'
        },
        {
            type: 'complement' as RelationshipType,
            icon: <LinkSquare20Regular />,
            title: 'Complement',
            description: 'Technologies that work well together'
        },
        {
            type: 'evolution' as RelationshipType,
            icon: <DataTrendingRegular />,
            title: 'Evolution',
            description: 'Natural progression or upgrade path'
        },
        {
            type: 'alternative' as RelationshipType,
            icon: <ScalesRegular />,
            title: 'Alternative',
            description: 'Different options solving similar problems'
        },
        {
            type: 'comparison' as RelationshipType,
            icon: <SearchRegular />,
            title: 'Comparison',
            description: 'Technologies often compared or evaluated together'
        },
        {
            type: 'migration' as RelationshipType,
            icon: <ArrowSyncRegular />,
            title: 'Migration',
            description: 'Migration path from one technology to another'
        },
        {
            type: 'ecosystem' as RelationshipType,
            icon: <GlobeRegular />,
            title: 'Ecosystem',
            description: 'Part of the same technology ecosystem'
        },
    ];

    const tooltipContent = (
        <div style={{
            maxWidth: '320px',
            padding: '12px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        }}>
            <Title3 as="h4" style={{
                color: '#ffffff',
                margin: 0,
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
            }}>
                Relationship Types
            </Title3>
            <div style={{
                display: 'grid',
                gap: '8px',
                marginTop: '8px',
            }}>
                {relationshipDefinitions.map((rel) => (
                    <div key={rel.type} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                    }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            marginTop: '1px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255, 255, 255, 0.8)',
                        }}>
                            {rel.icon}
                        </div>
                        <div style={{ lineHeight: '1.4' }}>
                            <div style={{
                                fontWeight: 600,
                                marginBottom: '2px',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}>
                                {rel.title}
                            </div>
                            <div style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '12px',
                                fontFamily: "'IBM Plex Mono', monospace",
                            }}>
                                {rel.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Tooltip
            content={tooltipContent}
            relationship="description"
            positioning="above-start"
            withArrow
            mountNode={typeof document !== 'undefined' ? document.body : undefined}
        >
            <Button
                style={{
                    minWidth: 'auto',
                    width: '20px',
                    height: '20px',
                    padding: '2px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    cursor: 'pointer',
                }}
                icon={<InfoRegular />}
                appearance="subtle"
                size="small"
                aria-label="Learn about relationship types"
                title="Learn about relationship types"
            />
        </Tooltip>
    );
};

const RelationshipTypesTooltip: React.FC = RelationshipTypesTooltipInner;

export default RelationshipTypesTooltip;
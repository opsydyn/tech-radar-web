import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { getEffectiveTheme } from '~stores/theme-store';
import { vars } from '~styles/cyberpunk.css';
import type { DependencyCategory } from '~utils/mockDependabotData';
import { CATEGORY_COLOR_SCHEMES } from '~utils/mockDependabotData';

// Types following functional programming patterns
type LegendType = 'burndown' | 'category' | 'severity';

type BurndownLegendProps = {
    readonly type: 'burndown';
    readonly compact?: boolean;
};

type CategoryLegendProps = {
    readonly type: 'category';
    readonly categories: readonly DependencyCategory[];
    readonly compact?: boolean;
};

type SeverityLegendProps = {
    readonly type: 'severity';
    readonly compact?: boolean;
};

type TechDebtLegendProps = BurndownLegendProps | CategoryLegendProps | SeverityLegendProps;

// Lookup tables for legend configurations
const BURNDOWN_LEGEND_CONFIG = {
    domain: ['Actual Resolutions', 'Target Goal'],
    colors: [vars.colors.neonPink, vars.colors.neonBlue],
    symbols: ['line', 'dashed-line']
} as const;

const SEVERITY_LEGEND_CONFIG = {
    domain: ['Major Updates', 'Minor Updates', 'Patch Updates'],
    colors: ['#ef4444', '#f97316', '#22c55e'],
    symbols: ['circle', 'circle', 'circle']
} as const;

const LEGEND_STYLES = {
    container: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap' as const,
        fontFamily: vars.fonts.mono,
        fontSize: '0.875rem',
        width: '100%',
        overflow: 'hidden'
    },
    compactContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
        fontFamily: vars.fonts.mono,
        fontSize: '0.75rem',
        width: '100%',
        overflow: 'hidden'
    }
} as const;

// Pure function to create burndown scale
const createBurndownScale = () =>
    scaleOrdinal({
        domain: [...BURNDOWN_LEGEND_CONFIG.domain],
        range: [...BURNDOWN_LEGEND_CONFIG.colors]
    });

// Pure function to create category scale
const createCategoryScale = (categories: readonly DependencyCategory[]) =>
    scaleOrdinal({
        domain: [...categories],
        range: [...categories.map(cat => CATEGORY_COLOR_SCHEMES[cat].bright)]
    });

// Pure function to create severity scale
const createSeverityScale = () =>
    scaleOrdinal({
        domain: [...SEVERITY_LEGEND_CONFIG.domain],
        range: [...SEVERITY_LEGEND_CONFIG.colors]
    });

// Pure function to get theme-appropriate text color
const getTextColor = (isDark: boolean): string =>
    isDark ? vars.colors.neonBlue : '#333333';

// Custom legend item renderers
const BurndownLegendItem = ({ label, color, isDark }: { label: string; color: string; isDark: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
            style={{
                width: '20px',
                height: label.includes('Target') ? '2px' : '3px',
                background: color,
                borderRadius: '1px',
                ...(label.includes('Target') && {
                    borderStyle: 'dashed',
                    opacity: 0.8
                })
            }}
        />
        <span style={{ color: getTextColor(isDark), fontSize: '0.875rem' }}>
            {label}
        </span>
    </div>
);

const CategoryLegendItem = ({ label, color, isDark }: { label: string; color: string; isDark: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
            style={{
                width: '12px',
                height: '12px',
                background: color,
                borderRadius: '2px',
                border: `1px solid ${isDark ? vars.colors.darkBgAlt : '#e0e0e0'}`
            }}
        />
        <span style={{ color: getTextColor(isDark), fontSize: '0.875rem' }}>
            {label}
        </span>
    </div>
);

const SeverityLegendItem = ({ label, color, isDark }: { label: string; color: string; isDark: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
            style={{
                width: '8px',
                height: '8px',
                background: color,
                borderRadius: '50%',
                border: `1px solid ${isDark ? vars.colors.darkBgAlt : '#e0e0e0'}`
            }}
        />
        <span style={{ color: getTextColor(isDark), fontSize: '0.875rem' }}>
            {label}
        </span>
    </div>
);

// Main legend component using pattern matching
export const TechDebtLegend = (props: TechDebtLegendProps) => {
    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark' || effectiveTheme === 'machine';
    const containerStyle = props.compact ? LEGEND_STYLES.compactContainer : LEGEND_STYLES.container;

    // Pattern matching for different legend types
    switch (props.type) {
        case 'burndown': {
            const scale = createBurndownScale();
            return (
                <div style={containerStyle}>
                    {BURNDOWN_LEGEND_CONFIG.domain.map((label, index) => (
                        <BurndownLegendItem
                            key={label}
                            label={label}
                            color={BURNDOWN_LEGEND_CONFIG.colors[index]}
                            isDark={isDark}
                        />
                    ))}
                </div>
            );
        }

        case 'category': {
            const scale = createCategoryScale(props.categories);
            return (
                <div style={containerStyle}>
                    {props.categories.map(category => (
                        <CategoryLegendItem
                            key={category}
                            label={category}
                            color={CATEGORY_COLOR_SCHEMES[category].bright}
                            isDark={isDark}
                        />
                    ))}
                </div>
            );
        }

        case 'severity': {
            const scale = createSeverityScale();
            return (
                <div style={containerStyle}>
                    {SEVERITY_LEGEND_CONFIG.domain.map((label, index) => (
                        <SeverityLegendItem
                            key={label}
                            label={label}
                            color={SEVERITY_LEGEND_CONFIG.colors[index]}
                            isDark={isDark}
                        />
                    ))}
                </div>
            );
        }

        default:
            return null;
    }
};

export default TechDebtLegend;
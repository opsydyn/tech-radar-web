import {
    CheckmarkCircleRegular,
    ClockRegular,
    DocumentRegular,
    ErrorCircleRegular,
    LightbulbRegular,
    QuestionCircleRegular
} from '@fluentui/react-icons';
import type React from 'react';
import { match } from 'ts-pattern';
import type { DocumentFreshness, DocumentFreshnessLevel } from '../utils/documentFreshness';
import * as styles from './DocumentFreshnessIndicator.css';

// Lookup table for icons using exhaustive pattern matching
const FRESHNESS_ICONS: Record<DocumentFreshnessLevel, React.ReactElement> = {
    fresh: <CheckmarkCircleRegular />,
    aging: <ClockRegular />,
    stale: <DocumentRegular />,
    critical: <ErrorCircleRegular />,
    invalid: <QuestionCircleRegular />
};

// Function to get icon using pattern matching (exhaustive)
const getFreshnessIcon = (level: DocumentFreshnessLevel): React.ReactElement =>
    match(level)
        .with('fresh', () => FRESHNESS_ICONS.fresh)
        .with('aging', () => FRESHNESS_ICONS.aging)
        .with('stale', () => FRESHNESS_ICONS.stale)
        .with('critical', () => FRESHNESS_ICONS.critical)
        .with('invalid', () => FRESHNESS_ICONS.invalid)
        .exhaustive();

type Props = {
    freshness: DocumentFreshness;
    showRecommendation?: boolean;
    size?: 'small' | 'medium' | 'large';
};

const DocumentFreshnessIndicator: React.FC<Props> = ({
    freshness,
    showRecommendation = true,
    size = 'medium'
}) => {
    const badgeClassName = match(freshness.level)
        .with('fresh', () => styles.badgeVariants.fresh)
        .with('aging', () => styles.badgeVariants.aging)
        .with('stale', () => styles.badgeVariants.stale)
        .with('critical', () => styles.badgeVariants.critical)
        .with('invalid', () => styles.badgeVariants.invalid)
        .exhaustive();

    const sizeClassName = match(size)
        .with('small', () => styles.sizeVariants.small)
        .with('medium', () => styles.sizeVariants.medium)
        .with('large', () => styles.sizeVariants.large)
        .exhaustive();

    const shouldShowRecommendation = match([showRecommendation, freshness.actionable])
        .with([true, true], () => true)
        .otherwise(() => false);

    return (
        <div className={`${styles.container} ${styles.responsiveContainer}`}>
            {/* Freshness Badge */}
            <div className={`${badgeClassName} ${sizeClassName}`}>
                <div className={styles.iconContainer}>
                    {getFreshnessIcon(freshness.level)}
                </div>
                <span className={styles.textContainer}>
                    {freshness.message}
                </span>
            </div>

            {/* Recommendation */}
            {shouldShowRecommendation && (
                <div className={styles.recommendation}>
                    <div className={styles.recommendationIcon}>
                        <LightbulbRegular />
                    </div>
                    <span>{freshness.recommendation}</span>
                </div>
            )}
        </div>
    );
};

export default DocumentFreshnessIndicator;
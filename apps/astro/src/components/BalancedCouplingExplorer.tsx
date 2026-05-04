import { Button, Card, Text, Tooltip } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import { useMachine } from '@xstate/react';
import React from "react";
import BalancedCouplingBarChart from "./BalancedCouplingBarChart";
import * as styles from './BalancedCouplingExplorer.css';
import {
    type SystemExample,
    analyzeContext,
    balancedCouplingMachine,
    findMatchingPreset,
    getDistanceDescription,
    getStrengthDescription,
    getVolatilityDescription,
    presetScenarios
} from './BalancedCouplingExplorer.machine';
import BalancedCouplingScatterPlot from "./BalancedCouplingScatterPlot";

// Custom tooltip content with solid background
const createTooltipContent = (text: string) => (
    <div className={styles.tooltip}>
        {text}
    </div>
);

// New component for system examples
const SystemExampleCard: React.FC<{ example: SystemExample }> = ({ example }) => {
    const riskColors = {
        low: '#b5e853',
        medium: '#ffe066',
        high: '#ff5e5b'
    };

    return (
        <Card className={styles.systemExampleCard}>
            <div className={styles.systemExampleHeader}>
                <Text weight="semibold" size={400}>{example.name}</Text>
                <div
                    className={styles.riskIndicator}
                    style={{ backgroundColor: riskColors[example.riskLevel] }}
                >
                    {example.riskLevel} risk
                </div>
            </div>
            <Text size={300}>{example.description}</Text>
            <div className={styles.systemExampleDetails}>
                <div className={styles.systemExampleParam}>
                    <Text size={200} weight="semibold">Strength:</Text>
                    <Text size={200}>{example.strength[0]}-{example.strength[1]}</Text>
                </div>
                <div className={styles.systemExampleParam}>
                    <Text size={200} weight="semibold">Distance:</Text>
                    <Text size={200}>{example.distance[0]}-{example.distance[1]}</Text>
                </div>
                <div className={styles.systemExampleParam}>
                    <Text size={200} weight="semibold">Volatility:</Text>
                    <Text size={200}>{example.volatility[0]}-{example.volatility[1]}</Text>
                </div>
            </div>
            <div className={styles.systemExampleRecommendation}>
                <Text size={200} weight="semibold">Recommendation:</Text>
                <Text size={200}>{example.recommendation}</Text>
            </div>
        </Card>
    );
};

export default function BalancedCouplingExplorer() {
    // Imperative shell - XState machine handles all state management
    const [state, send] = useMachine(balancedCouplingMachine);

    // Extract values from machine context (functional core)
    const { strength, distance, volatility } = state.context;

    // Event handlers (imperative shell)
    const handleStrengthChange = (value: number) => {
        send({ type: 'SET_STRENGTH', value });
    };

    const handleDistanceChange = (value: number) => {
        send({ type: 'SET_DISTANCE', value });
    };

    const handleVolatilityChange = (value: number) => {
        send({ type: 'SET_VOLATILITY', value });
    };

    const applyPreset = (preset: typeof presetScenarios[0]) => {
        send({ type: 'APPLY_PRESET', preset });
    };

    // Pure function calls (functional core)
    const getCurrentActivePreset = (): string | null => {
        return findMatchingPreset(strength, distance, volatility);
    };

    // Derived values using Effect-style functional analyzer (functional core)
    const analysis = analyzeContext(state.context);
    const { modularity, balance, feedback, matchingExamples } = analysis;

    return (
        <div className={styles.container}>
            {/* Preset Scenarios Section */}
            <div className={styles.presetsContainer}>
                <Text as="h3" size={500} weight="semibold" className={styles.presetsTitle}>
                    Common Scenarios
                </Text>
                <div className={styles.presetButtons}>
                    {presetScenarios.map((preset) => {
                        const isActive = getCurrentActivePreset() === preset.name;
                        return (
                            <Button
                                key={preset.name}
                                appearance="outline"
                                size="small"
                                onClick={() => applyPreset(preset)}
                                title={preset.description}
                                className={styles.presetButton[isActive ? 'active' : 'inactive']}
                            >
                                {preset.name}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Sliders Section */}
            <div className={styles.sliderContainer}>
                <label className={styles.labelStyle}>
                    <div className={styles.labelHeader}>
                        <Text weight="semibold" className={styles.labelText}>Strength</Text>
                        <Tooltip
                            content={createTooltipContent(getStrengthDescription(strength))}
                            relationship="description"
                        >
                            <InfoRegular className={styles.infoIcon} />
                        </Tooltip>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        value={strength}
                        onChange={e => handleStrengthChange(Number(e.target.value))}
                        aria-label="Integration Strength"
                        className={styles.slider}
                    />
                    <Text size={300} weight="bold" className={styles.labelValue}>{strength}</Text>
                </label>
                <label className={styles.labelStyle}>
                    <div className={styles.labelHeader}>
                        <Text weight="semibold" className={styles.labelText}>Distance</Text>
                        <Tooltip
                            content={createTooltipContent(getDistanceDescription(distance))}
                            relationship="description"
                        >
                            <InfoRegular className={styles.infoIcon} />
                        </Tooltip>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        value={distance}
                        onChange={e => handleDistanceChange(Number(e.target.value))}
                        aria-label="Distance"
                        className={styles.slider}
                    />
                    <Text size={300} weight="bold" className={styles.labelValue}>{distance}</Text>
                </label>
                <label className={styles.labelStyle}>
                    <div className={styles.labelHeader}>
                        <Text weight="semibold" className={styles.labelText}>Volatility</Text>
                        <Tooltip
                            content={createTooltipContent(getVolatilityDescription(volatility))}
                            relationship="description"
                        >
                            <InfoRegular className={styles.infoIcon} />
                        </Tooltip>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        value={volatility}
                        onChange={e => handleVolatilityChange(Number(e.target.value))}
                        aria-label="Volatility"
                        className={styles.slider}
                    />
                    <Text size={300} weight="bold" className={styles.labelValue}>{volatility}</Text>
                </label>
            </div>

            {/* Charts Section */}
            <div className={styles.chartsContainer}>
                <div className={styles.chartSection}>
                    <Text as="h3" size={400} weight="semibold" className={styles.chartTitle}>
                        Modularity & Balance
                    </Text>
                    <BalancedCouplingBarChart strength={strength} distance={distance} volatility={volatility} />
                </div>

                <div className={styles.chartSection}>
                    <Text as="h3" size={400} weight="semibold" className={styles.chartTitle}>
                        Three-Dimensional View
                    </Text>
                    <BalancedCouplingScatterPlot
                        data={[{
                            label: 'Current',
                            strength,
                            distance,
                            volatility
                        }]}
                    />
                </div>
            </div>

            {/* Formula and Feedback Section */}
            <div className={styles.bottomSection}>
                <div className={styles.formula}>
                    MODULARITY = |{strength} - {distance}| + 1 = {modularity}<br />
                    BALANCE = max({modularity}, 10 - {volatility} + 1) = {balance}
                </div>

                <Card className={styles.feedbackCard}>
                    <div className={styles.feedbackContent}>
                        {feedback}
                    </div>
                </Card>
            </div>

            {/* System Examples Section */}
            {matchingExamples.length > 0 && (
                <div className={styles.systemExamplesSection}>
                    <Text as="h3" size={500} weight="semibold" className={styles.sectionTitle}>
                        Similar System Examples
                    </Text>
                    <div className={styles.systemExamplesContainer}>
                        {matchingExamples.map(example => (
                            <SystemExampleCard key={example.name} example={example} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
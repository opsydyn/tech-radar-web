import { actions } from "astro:actions";
import { useState } from "react";
import CopilotKitChat from "./CopilotKitChat"; // Keeping as backup option
import { MastraChat } from "./MastraChat";
import * as styles from "./TechRadarAITest.css";

type ActiveTab = "chat" | "actions";

type TechAnalysisResult = {
    quadrant: string;
    ring: string;
    reasoning: string;
    benefits: string[];
    risks: string[];
    recommendations: string[];
};

type AnalysisResponse = {
    success: boolean;
    data?: TechAnalysisResult;
    error?: string;
    rawResponse?: string;
    timestamp?: string;
    model?: string;
    tokensUsed?: number;
};

export default function TechRadarAITest() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
    const [technology, setTechnology] = useState("");
    const [context, setContext] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!technology.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await actions.analyzeTechnology({
                technology: technology.trim(),
                context: context.trim() || undefined,
            });

            if (response.error) {
                setError(response.error.message || "An error occurred");
            } else {
                setResult(response.data || null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const renderAnalysisResult = (analysis: TechAnalysisResult, metadata?: {
        timestamp?: string;
        model?: string;
        tokensUsed?: number;
        rawResponse?: string;
    }) => (
        <div className={styles.analysisResult}>
            <h3 className={styles.analysisTitle}>Analysis Results</h3>

            <div className={styles.analysisCard}>
                <div className={styles.placementInfo}>
                    <span className={styles.quadrantBadge}>{analysis.quadrant}</span>
                    <span className={styles.ringBadge}>{analysis.ring}</span>
                </div>
            </div>

            <div className={styles.analysisCard}>
                <h4 className={styles.analysisText} style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Reasoning
                </h4>
                <p className={styles.analysisText}>{analysis.reasoning}</p>
            </div>

            {analysis.benefits && analysis.benefits.length > 0 && (
                <div className={styles.analysisCard}>
                    <h4 className={styles.analysisText} style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Benefits
                    </h4>
                    <ul className={styles.analysisList}>
                        {analysis.benefits.map((benefit, index) => (
                            <li key={`benefit-${index}`} className={styles.analysisListItem}>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.risks && analysis.risks.length > 0 && (
                <div className={styles.analysisCard}>
                    <h4 className={styles.analysisText} style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Risks
                    </h4>
                    <ul className={styles.analysisList}>
                        {analysis.risks.map((risk, index) => (
                            <li key={`risk-${index}`} className={styles.analysisListItem}>
                                {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className={styles.analysisCard}>
                    <h4 className={styles.analysisText} style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Recommendations
                    </h4>
                    <ul className={styles.analysisList}>
                        {analysis.recommendations.map((rec, index) => (
                            <li key={`recommendation-${index}`} className={styles.analysisListItem}>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {metadata?.rawResponse && (
                <div className={styles.analysisCard}>
                    <h4 className={styles.analysisText} style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                        Raw Response
                    </h4>
                    <pre className={styles.rawResponse}>{metadata.rawResponse}</pre>
                </div>
            )}

            {(metadata?.timestamp || metadata?.model || metadata?.tokensUsed) && (
                <div className={styles.metadata}>
                    {metadata.timestamp && <div>Generated: {new Date(metadata.timestamp).toLocaleString()}</div>}
                    {metadata.model && <div>Model: {metadata.model}</div>}
                    {metadata.tokensUsed && <div>Tokens Used: {metadata.tokensUsed}</div>}
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.testHeader}>
                {/* <h1 className={styles.headerTitle}>Tech Radar AI Interface</h1>
                <p className={styles.headerSubtitle}>
                    Test the AI-powered technology analysis and chat capabilities
                </p> */}

                {/* <div className={styles.tabButtons}>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === "chat" ? styles.tabButtonActive : ""}`}
                        data-active={activeTab === "chat"}
                        onClick={() => setActiveTab("chat")}
                    >
                        AI Chat
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${activeTab === "actions" ? styles.tabButtonActive : ""}`}
                        data-active={activeTab === "actions"}
                        onClick={() => setActiveTab("actions")}
                    >
                        Direct Actions
                    </button>
                </div> */}
            </header>

            {activeTab === "chat" && (
                <section className={styles.chatSection}>
                    <div className={styles.crtChatContainer}>
                        {/* <div className={styles.systemReadyHeader}>
                            <h2 style={{ margin: "0 0 8px 0" }}>SYSTEM READY</h2>
                            <p style={{ margin: "0", opacity: 0.8 }}>Tech Radar AI Assistant</p>
                        </div> */}
                        <MastraChat />
                        {/* <CopilotKitChat /> */}
                    </div>
                </section>
            )}

            {activeTab === "actions" && (
                <section className={styles.actionsSection}>
                    <div className={styles.retroActionsContainer}>
                        <div className={styles.systemFormHeader}>
                            TECH RADAR ANALYSIS SYSTEM
                        </div>
                        <div className={styles.systemFormHeader} style={{ fontSize: "0.9rem", marginBottom: "2rem" }}>
                            DIRECT ANALYSIS INTERFACE ACTIVE
                        </div>

                        <form className={styles.testForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="technology" className={styles.formLabel}>
                                    Technology Name *
                                </label>
                                <input
                                    type="text"
                                    id="technology"
                                    className={styles.formInput}
                                    value={technology}
                                    onChange={(e) => setTechnology(e.target.value)}
                                    placeholder="e.g., React, Kubernetes, GraphQL"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="context" className={styles.formLabel}>
                                    Context (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="context"
                                    className={styles.formInput}
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="e.g., for web development, enterprise applications"
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading || !technology.trim()}
                            >
                                {isLoading && <div className={styles.spinner} />}
                                {isLoading ? "Analyzing..." : "Analyze Technology"}
                            </button>
                        </form>

                        {error && (
                            <div className={styles.errorMessage}>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {result?.data && renderAnalysisResult(
                            result.data,
                            {
                                timestamp: result.timestamp,
                                model: result.model,
                                tokensUsed: result.tokensUsed,
                                rawResponse: result.rawResponse,
                            }
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
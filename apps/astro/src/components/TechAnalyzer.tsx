import { actions, isActionError, isInputError } from "astro:actions";
import { useState } from "react";

type AnalysisResult = {
    success: boolean;
    analysis?: {
        quadrant: string;
        ring: string;
        description: string;
        reasoning: string;
        benefits: string[];
        risks: string[];
        adoptionStrategy: string;
        timeToValue: string;
        skillsRequired: string[];
    };
    generatedAt?: Date;
    rawResponse?: string;
    error?: string;
};

export const TechAnalyzer = () => {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const input = {
                name: formData.get("name") as string,
                description: formData.get("description") as string || undefined,
                context: formData.get("context") as string || undefined,
                organizationSize: formData.get("organizationSize") as string || undefined,
                industry: formData.get("industry") as string || undefined,
            };

            const { data, error: actionError } = await actions.analyzeTechnology(input);

            if (actionError) {
                if (isInputError(actionError)) {
                    setError(`Invalid input: ${actionError.fields.map((f: { message: any; }) => f.message).join(', ')}`);
                } else if (isActionError(actionError)) {
                    setError(`Analysis failed: ${actionError.message}`);
                } else {
                    setError("An unexpected error occurred");
                }
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Failed to analyze technology");
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tech-analyzer">
            <h2>AI Technology Analyzer</h2>

            <form action={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Technology Name *</label>
                    <input
                        name="name"
                        id="name"
                        placeholder="e.g., React, Docker, GraphQL"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Brief description of the technology"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="organizationSize">Organization Size</label>
                    <select name="organizationSize" id="organizationSize">
                        <option value="">Select size...</option>
                        <option value="startup">Startup</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="industry">Industry</label>
                    <input
                        name="industry"
                        id="industry"
                        placeholder="e.g., Fintech, Healthcare, E-commerce"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="context">Context</label>
                    <textarea
                        name="context"
                        id="context"
                        placeholder="Your organization's context, constraints, or specific use case"
                        rows={4}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Technology'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div className="analysis-result">
                    <h3>Analysis Results</h3>
                    {result.success && result.analysis ? (
                        <div className="analysis-details">
                            <div className="placement">
                                <strong>Recommended Placement:</strong> {result.analysis.quadrant} → {result.analysis.ring}
                            </div>

                            <div className="description">
                                <strong>Description:</strong> {result.analysis.description}
                            </div>

                            <div className="reasoning">
                                <strong>Reasoning:</strong> {result.analysis.reasoning}
                            </div>

                            <div className="benefits">
                                <strong>Benefits:</strong>
                                <ul>
                                    {result.analysis.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="risks">
                                <strong>Risks:</strong>
                                <ul>
                                    {result.analysis.risks.map((risk, i) => (
                                        <li key={i}>{risk}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="adoption">
                                <strong>Adoption Strategy:</strong> {result.analysis.adoptionStrategy}
                            </div>

                            <div className="time-to-value">
                                <strong>Time to Value:</strong> {result.analysis.timeToValue}
                            </div>

                            <div className="skills">
                                <strong>Skills Required:</strong>
                                <ul>
                                    {result.analysis.skillsRequired.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="raw-response">
                            <strong>Raw Response:</strong>
                            <pre>{result.rawResponse}</pre>
                        </div>
                    )}

                    {result.generatedAt && (
                        <div className="metadata">
                            <small>Generated: {result.generatedAt.toLocaleString()}</small>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
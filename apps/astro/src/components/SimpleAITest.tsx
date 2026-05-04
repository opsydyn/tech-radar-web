import { useState } from "react";

interface AnalysisResult {
	success: boolean;
	analysis?: {
		quadrant: string;
		ring: string;
		description: string;
		reasoning: string;
		benefits: string[];
		risks: string[];
		adoptionStrategy?: string;
		timeToValue?: string;
		skillsRequired?: string[];
	};
	generatedAt?: Date;
	rawResponse?: string;
	error?: string;
}

export function SimpleAITest() {
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAnalysis = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);

		try {
			const input = {
				name: formData.get("name") as string,
				description: formData.get("description") as string || undefined,
				context: formData.get("context") as string || undefined,
				organizationSize: formData.get("organizationSize") as string || undefined,
			};

			// Call Astro Actions directly
			const response = await fetch('/_actions/analyzeTechnology', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(input)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			setResult(data);

		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
			setError(`Analysis failed: ${errorMessage}`);
			console.error('Analysis error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="simple-ai-test">
			<div className="test-header">
				<h1>🤖 Tech Radar AI Assistant</h1>
				<p>Test your OpenRouter + Mastra integration</p>
			</div>

			<div className="test-form-container">
				<h2>Technology Analysis</h2>
				<form onSubmit={handleAnalysis} className="test-form">
					<div className="form-group">
						<label htmlFor="name">Technology Name *</label>
						<input
							name="name"
							id="name"
							placeholder="e.g., React, Docker, GraphQL, Kubernetes"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							name="description"
							id="description"
							placeholder="Brief description of the technology and its purpose"
							rows={3}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="organizationSize">Organization Size</label>
						<select name="organizationSize" id="organizationSize">
							<option value="">Select size...</option>
							<option value="startup">Startup (1-10 people)</option>
							<option value="small">Small (11-50 people)</option>
							<option value="medium">Medium (51-200 people)</option>
							<option value="large">Large (201-1000 people)</option>
							<option value="enterprise">Enterprise (1000+ people)</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="context">Context & Requirements</label>
						<textarea
							name="context"
							id="context"
							placeholder="Your organization's context, current tech stack, constraints, or specific use case"
							rows={4}
						/>
					</div>

					<button type="submit" disabled={loading} className="submit-button">
						{loading ? (
							<>
								<span className="spinner" />
								Analyzing...
							</>
						) : (
							'🚀 Analyze Technology'
						)}
					</button>
				</form>
			</div>

			{error && (
				<div className="error-message">
					<h3>❌ Error</h3>
					<p>{error}</p>
					<details>
						<summary>Troubleshooting Steps</summary>
						<ul>
							<li>Make sure your <code>OPENROUTER_API_KEY</code> is set in <code>.env</code></li>
							<li>Verify Mastra server is running: <code>mastra dev</code></li>
							<li>Check browser console for additional error details</li>
							<li>Ensure your OpenRouter account has credits</li>
						</ul>
					</details>
				</div>
			)}

			{result && (
				<div className="analysis-result">
					<h3>✅ Analysis Results</h3>
					{result.success && result.analysis ? (
						<div className="analysis-details">
							<div className="placement-card">
								<h4>📍 Recommended Placement</h4>
								<div className="placement-info">
									<span className="quadrant">{result.analysis.quadrant}</span>
									<span className="arrow">→</span>
									<span className="ring">{result.analysis.ring}</span>
								</div>
							</div>

							<div className="description-card">
								<h4>📝 Description</h4>
								<p>{result.analysis.description}</p>
							</div>

							<div className="reasoning-card">
								<h4>🤔 Reasoning</h4>
								<p>{result.analysis.reasoning}</p>
							</div>

							<div className="benefits-risks">
								<div className="benefits-card">
									<h4>✅ Benefits</h4>
									<ul>
										{result.analysis.benefits?.map((benefit, index) => (
											<li key={`benefit-${index}`}>{benefit}</li>
										))}
									</ul>
								</div>

								<div className="risks-card">
									<h4>⚠️ Risks</h4>
									<ul>
										{result.analysis.risks?.map((risk, index) => (
											<li key={`risk-${index}`}>{risk}</li>
										))}
									</ul>
								</div>
							</div>

							{result.analysis.adoptionStrategy && (
								<div className="strategy-card">
									<h4>🎯 Adoption Strategy</h4>
									<p>{result.analysis.adoptionStrategy}</p>
								</div>
							)}

							{result.analysis.timeToValue && (
								<div className="time-card">
									<h4>⏱️ Time to Value</h4>
									<p>{result.analysis.timeToValue}</p>
								</div>
							)}

							{result.analysis.skillsRequired && (
								<div className="skills-card">
									<h4>🎓 Skills Required</h4>
									<ul>
										{result.analysis.skillsRequired.map((skill, index) => (
											<li key={`skill-${index}`}>{skill}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					) : (
						<div className="raw-response">
							<h4>Raw Response</h4>
							<pre>{result.rawResponse}</pre>
						</div>
					)}

					{result.generatedAt && (
						<div className="metadata">
							Generated: {result.generatedAt.toLocaleString()}
						</div>
					)}
				</div>
			)}

			<style>{`
				.simple-ai-test {
					max-width: 800px;
					margin: 0 auto;
					padding: 2rem;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
				}

				.test-header {
					text-align: center;
					margin-bottom: 3rem;
				}

				.test-header h1 {
					font-size: 2.5rem;
					margin-bottom: 0.5rem;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.test-header p {
					color: #6b7280;
					font-size: 1.2rem;
				}

				.test-form-container {
					background: white;
					border-radius: 1rem;
					padding: 2rem;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
					margin-bottom: 2rem;
				}

				.test-form-container h2 {
					margin-top: 0;
					color: #1f2937;
					font-size: 1.5rem;
				}

				.form-group {
					margin-bottom: 1.5rem;
				}

				.form-group label {
					display: block;
					font-weight: 600;
					margin-bottom: 0.5rem;
					color: #374151;
				}

				.form-group input,
				.form-group textarea,
				.form-group select {
					width: 100%;
					padding: 0.75rem;
					border: 2px solid #e5e7eb;
					border-radius: 0.5rem;
					font-size: 1rem;
					transition: border-color 0.2s;
					box-sizing: border-box;
				}

				.form-group input:focus,
				.form-group textarea:focus,
				.form-group select:focus {
					outline: none;
					border-color: #3b82f6;
					box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
				}

				.submit-button {
					width: 100%;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					padding: 1rem 2rem;
					border: none;
					border-radius: 0.5rem;
					font-weight: 600;
					font-size: 1.1rem;
					cursor: pointer;
					transition: all 0.2s;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 0.5rem;
				}

				.submit-button:hover:not(:disabled) {
					transform: translateY(-2px);
					box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
				}

				.submit-button:disabled {
					opacity: 0.7;
					cursor: not-allowed;
					transform: none;
				}

				.spinner {
					width: 16px;
					height: 16px;
					border: 2px solid transparent;
					border-top: 2px solid white;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				@keyframes spin {
					to { transform: rotate(360deg); }
				}

				.error-message {
					background: #fef2f2;
					border: 2px solid #fecaca;
					padding: 1.5rem;
					border-radius: 0.75rem;
					margin-bottom: 2rem;
				}

				.error-message h3 {
					color: #dc2626;
					margin-top: 0;
				}

				.error-message p {
					color: #991b1b;
					margin-bottom: 1rem;
				}

				.error-message details {
					color: #7f1d1d;
				}

				.error-message code {
					background: #fee2e2;
					padding: 0.125rem 0.25rem;
					border-radius: 0.25rem;
					font-family: monospace;
					font-size: 0.875rem;
				}

				.analysis-result {
					background: #f0f9ff;
					border: 2px solid #bae6fd;
					padding: 2rem;
					border-radius: 1rem;
					margin-bottom: 2rem;
				}

				.analysis-result h3 {
					color: #0369a1;
					margin-top: 0;
				}

				.analysis-details > div {
					margin-bottom: 1.5rem;
					padding: 1rem;
					background: white;
					border-radius: 0.5rem;
					border: 1px solid #e0f2fe;
				}

				.analysis-details h4 {
					margin-top: 0;
					margin-bottom: 0.75rem;
					color: #0f172a;
				}

				.placement-card .placement-info {
					display: flex;
					align-items: center;
					gap: 1rem;
					font-size: 1.25rem;
					font-weight: 600;
				}

				.quadrant {
					background: #dbeafe;
					color: #1e40af;
					padding: 0.5rem 1rem;
					border-radius: 0.375rem;
				}

				.ring {
					background: #dcfce7;
					color: #166534;
					padding: 0.5rem 1rem;
					border-radius: 0.375rem;
				}

				.arrow {
					color: #6b7280;
					font-size: 1.5rem;
				}

				.benefits-risks {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 1rem;
				}

				@media (max-width: 768px) {
					.benefits-risks {
						grid-template-columns: 1fr;
					}

					.placement-info {
						flex-direction: column;
						gap: 0.5rem;
					}
				}

				.benefits-card {
					background: #f0fdf4;
					border: 1px solid #bbf7d0;
					padding: 1rem;
					border-radius: 0.5rem;
				}

				.risks-card {
					background: #fffbeb;
					border: 1px solid #fed7aa;
					padding: 1rem;
					border-radius: 0.5rem;
				}

				.analysis-details ul {
					margin: 0.5rem 0 0 1.5rem;
					padding: 0;
				}

				.analysis-details li {
					margin-bottom: 0.25rem;
				}

				.raw-response pre {
					background: #f3f4f6;
					padding: 1rem;
					border-radius: 0.375rem;
					overflow-x: auto;
					white-space: pre-wrap;
					font-size: 0.875rem;
				}

				.metadata {
					margin-top: 1.5rem;
					padding-top: 1rem;
					border-top: 1px solid #bae6fd;
					color: #6b7280;
					font-size: 0.875rem;
				}
			`}</style>
		</div>
	);
}

export default SimpleAITest;
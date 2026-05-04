import { actions } from "astro:actions";
import { useState } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

type MastraChatProps = {
    className?: string;
};

export function MastraChat({ className }: MastraChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "SYSTEM INITIALIZED >>> TECH RADAR ANALYSIS MODULE LOADED >>> How can I help you analyze technologies today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Use the analyzeTechnology action as a general chat interface
            const result = await actions.analyzeTechnology({
                name: input,
                description: "General tech radar inquiry",
                context: "User asking for general guidance about technology analysis",
            });

            const assistantMessage: Message = {
                role: "assistant",
                content: result.data?.success
                    ? `ANALYSIS COMPLETE >>> ${JSON.stringify(result.data.analysis, null, 2)}`
                    : result.data?.rawResponse || "I apologize, but I encountered an error processing your request.",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: "assistant",
                content: "ERROR >>> System encountered an error. Please check your OpenRouter API key configuration.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`mastra-chat ${className || ""}`} style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                backgroundColor: 'rgba(0, 17, 0, 0.8)',
                borderBottom: '1px solid rgba(0, 255, 65, 0.3)',
                color: '#00FF41',
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '20px',
                boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.3)',
                position: 'relative',
            }}>
                <h2 style={{
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textShadow: '0 0 4px rgba(0, 255, 65, 0.3)',
                }}>TECH RADAR ANALYSIS SYSTEM  v0.1</h2>
                <p style={{
                    margin: '0',
                    opacity: 0.7,
                    fontSize: '0.9rem',
                    color: 'rgba(0, 255, 65, 0.8)',
                    letterSpacing: '0.05em',
                }}> AGENT ACTIVE</p>
            </div>

            <div style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#00FF41',
                padding: '16px',
                overflowY: 'auto',
                fontFamily: "'IBM Plex Mono', monospace",
                background: 'linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%)',
                backgroundSize: '100% 4px',
            }}>
                {messages.map((message, index) => (
                    <div
                        key={`${message.timestamp.getTime()}-${index}`}
                        style={{
                            backgroundColor: message.role === 'user'
                                ? 'rgba(0, 17, 0, 0.4)'
                                : 'rgba(0, 17, 0, 0.6)',
                            border: message.role === 'user'
                                ? '1px solid rgba(0, 255, 65, 0.4)'
                                : '1px solid rgba(0, 255, 65, 0.3)',
                            borderRadius: '0',
                            margin: '8px 0',
                            padding: '12px 16px',
                            color: message.role === 'user' ? '#00FF41' : '#00FF41',
                            textAlign: message.role === 'user' ? 'right' : 'left',
                            marginLeft: message.role === 'user' ? '60px' : '0',
                            marginRight: message.role === 'user' ? '0' : '60px',
                            boxShadow: message.role === 'user'
                                ? 'inset 0 1px 2px rgba(0, 255, 65, 0.1)'
                                : 'inset 0 1px 3px rgba(0,0,0,0.4)',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            fontWeight: message.role === 'user' ? '500' : '400',
                            letterSpacing: '0.02em',
                            position: 'relative'
                        }}
                    >
                        {message.role === 'user' && <span style={{ color: 'rgba(0, 255, 65, 0.6)' }}>{'>>> '}</span>}
                        {message.role === 'assistant' && <span style={{ color: 'rgba(0, 255, 65, 0.6)' }}>{'<<< '}</span>}
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div style={{
                        backgroundColor: 'rgba(0, 17, 0, 0.6)',
                        border: '1px solid rgba(0, 255, 65, 0.3)',
                        borderRadius: '0',
                        margin: '8px 0',
                        padding: '12px',
                        color: '#00FF41',
                        marginRight: '60px',
                        fontSize: '0.9rem',
                    }}>
                        {'<<< PROCESSING...'}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{
                backgroundColor: 'rgba(0, 17, 0, 0.7)',
                border: '1px solid rgba(0, 255, 65, 0.4)',
                borderTop: '2px solid rgba(0, 255, 65, 0.3)',
                borderRadius: '0',
                padding: '12px 16px',
                margin: '0',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
            }}>
                <span style={{
                    color: 'rgba(0, 255, 65, 0.8)',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.9rem',
                    fontWeight: '600',
                }}>
                    {'>>>'}
                </span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about technologies, trends, or analysis..."
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#00FF41',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.9rem',
                        outline: 'none',
                        letterSpacing: '0.02em',
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    style={{
                        backgroundColor: 'rgba(0, 17, 0, 0.6)',
                        border: '1px solid rgba(0, 255, 65, 0.5)',
                        borderRadius: '0',
                        color: '#00FF41',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: '600',
                        padding: '8px 12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                        fontSize: '0.8rem',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
                        e.currentTarget.style.color = '#00FF41';
                        e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 17, 0, 0.6)';
                        e.currentTarget.style.color = '#00FF41';
                        e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.5)';
                    }}
                >
                    {isLoading ? 'PROCESSING...' : 'ANALYZE'}
                </button>
            </form>
        </div>
    );
}
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

interface CopilotKitChatProps {
    runtimeUrl?: string;
    agentName?: string;
}

export function CopilotKitChat({
    runtimeUrl = "/api/copilotkit/smart",
    agentName = "techRadarAgent"
}: CopilotKitChatProps) {
    return (
        <div className="copilot-container" style={{ height: '600px', width: '100%' }}>
            <CopilotKit
                runtimeUrl={runtimeUrl}
                agent={agentName}
                publicApiKey={import.meta.env.COPILOTKIT_API_KEY}
            >
                <CopilotChat
                    labels={{
                        title: "TECH RADAR ANALYSIS SYSTEM v0.1",
                        initial: "SYSTEM INITIALIZED >>> TECH RADAR ANALYSIS MODULE LOADED >>>",
                    }}
                    instructions="You are the TECH RADAR ANALYSIS SYSTEM, an AI assistant specializing in technology evaluation. Help users analyze technologies for the tech radar, providing recommendations on quadrants (Tools, Techniques, Platforms, Languages & Frameworks) and rings (Adopt, Trial, Assess, Hold). You have access to car search functionality for demonstration purposes. Be helpful, precise, and professional in your responses."
                />
            </CopilotKit>
        </div>
    );
}

export default CopilotKitChat;
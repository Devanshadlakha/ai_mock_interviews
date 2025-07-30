export interface SavedMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface Interview {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    level: string;
    questions: string[];
    finalized: boolean;
    createdAt: string;
}

export interface Feedback {
    id: string;
    interviewId: string;
    userId: string;
    transcript: SavedMessage[];
    createdAt: string;
}

export interface AgentProps {
    userName: string;
    userId: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions: string[];
}

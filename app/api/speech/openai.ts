import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAssistantResponse(transcript: string): Promise<string> {
    try {
        const chat = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful interview assistant." },
                { role: "user", content: transcript },
            ],
            model: "gpt-4",
        });

        return chat.choices[0].message.content || "No response generated.";
    } catch (error) {
        console.error("OpenAI chat error:", error);
        return "Unable to get assistant response.";
    }
}

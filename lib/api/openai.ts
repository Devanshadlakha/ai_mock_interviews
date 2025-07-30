import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateAIResponse(prompt: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "";
}


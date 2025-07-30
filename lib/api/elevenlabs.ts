const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY!;
const ELEVEN_VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || "TxGEqnHWrfWFTfGW9XjX";

export async function textToSpeech(text: string): Promise<Buffer> {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "xi-api-key": ELEVEN_LABS_API_KEY,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
        },
        body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
            },
        }),
    });

    if (!response.ok) throw new Error("Failed to convert text to speech.");
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}


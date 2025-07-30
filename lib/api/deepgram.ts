const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!;

export async function transcribeAudio(audioBuffer: Buffer) {
    const response = await fetch("https://api.deepgram.com/v1/listen", {
        method: "POST",
        headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "audio/mpeg",
        },
        body: audioBuffer,
    });

    if (!response.ok) throw new Error("Failed to transcribe audio");
    const data = await response.json();
    return data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
}

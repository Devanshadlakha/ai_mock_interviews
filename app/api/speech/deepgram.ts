import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: "nova-2",
                language: "en-US",
                smart_format: true,
            }
        );

        if (error || !result) {
            console.error("Deepgram transcription error:", error || "Empty result");
            return "Unable to transcribe audio.";
        }

        // Type assertion to help TypeScript understand the shape
        const transcription = result as any;

        const transcript =
            transcription.results?.channels?.[0]?.alternatives?.[0]?.transcript;

        if (!transcript) {
            return "No transcription found.";
        }

        return transcript;
    } catch (err) {
        console.error("Transcription failed:", err);
        return "Unable to transcribe audio.";
    }
}

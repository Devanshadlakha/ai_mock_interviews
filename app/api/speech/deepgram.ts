// /app/api/speech/deepgram.ts

import { Deepgram } from "@deepgram/sdk";

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY!);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
        const response = await deepgram.transcription.preRecorded(
            {
                buffer: audioBuffer,
                mimetype: "audio/webm",
            },
            {
                model: "nova-2",
                language: "en-US",
            }
        );

        const transcript =
            response.results.channels[0].alternatives[0].transcript;

        return transcript;
    } catch (error) {
        console.error("Deepgram transcription error:", error);
        return "Unable to transcribe audio.";
    }
}


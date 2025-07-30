// File: /app/api/voice/elevenlabs.ts

import axios from "axios";

export async function playTextWithElevenLabs(text: string): Promise<void> {
    try {
        const response = await axios({
            method: "POST",
            url: "https://api.elevenlabs.io/v1/text-to-speech/sarah", // Change voice ID as needed
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": process.env.ELEVENLABS_API_KEY as string,
            },
            data: {
                text,
                voice_settings: {
                    stability: 0.4,
                    similarity_boost: 0.8,
                    style: 0.5,
                    use_speaker_boost: true,
                },
            },
            responseType: "arraybuffer",
        });

        const blob = new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        await audio.play();
    } catch (error) {
        console.error("ElevenLabs playback error:", error);
    }
}

'use client';

import { useState, useRef } from 'react';
import axios from 'axios';

export default function VoiceInterview() {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        audioChunks.current = [];
        mediaRecorder.ondataavailable = (event) => audioChunks.current.push(event.data);

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');

            // Transcribe using Deepgram
            const transcriptRes = await axios.post(
                'https://api.deepgram.com/v1/listen?punctuate=true',
                audioBlob,
                {
                    headers: {
                        Authorization: `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
                        'Content-Type': 'audio/webm',
                    },
                }
            );

            const transcript = transcriptRes.data.results.channels[0].alternatives[0].transcript;

            // Send to backend API
            const audioRes = await axios.post(
                '/api/voice-interview',
                { transcript },
                { responseType: 'blob' }
            );

            const aiAudio = new Blob([audioRes.data], { type: 'audio/mpeg' });
            const aiUrl = URL.createObjectURL(aiAudio);
            setAudioUrl(aiUrl);

            new Audio(aiUrl).play();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <div className="p-6 border rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">🎙️ Mock Interview (Voice)</h2>
            <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500' : 'bg-green-600'}`}
            >
                {recording ? 'Stop Recording' : 'Start Interview'}
            </button>

            {audioUrl && (
                <div className="mt-4">
                    <audio controls src={audioUrl} />
                </div>
            )}
        </div>
    );
}

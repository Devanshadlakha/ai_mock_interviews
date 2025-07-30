import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { transcript } = body;

        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a professional interviewer. Ask technical questions and give concise feedback.',
                },
                {
                    role: 'user',
                    content: transcript,
                },
            ],
        });

        const aiMessage = chatResponse.choices[0].message.content;

        const elevenRes = await axios.post(
            'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream',
            {
                text: aiMessage,
                voice_settings: {
                    stability: 0.4,
                    similarity_boost: 0.7,
                },
            },
            {
                responseType: 'arraybuffer',
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );

        const audioBuffer = Buffer.from(elevenRes.data);

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error('[API ERROR]', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

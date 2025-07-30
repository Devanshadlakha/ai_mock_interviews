// Agent.tsx - AI Interviewer with Deepgram, OpenAI, and ElevenLabs

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createFeedback } from "@/lib/actions/general.action";
import { transcribeAudio } from "@/app/api/speech/deepgram";
import { getAssistantResponse } from "@/app/api/speech/openai";
import { playTextWithElevenLabs } from "@/app/api/speech/elevenlab";

interface AgentProps {
    userName: string;
    userId: string;
    profileImage?: string; // ✅ added to fix the error
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "evaluate";
    questions?: string[];
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

enum CallStatus {
    INACTIVE = "INACTIVE",
    ASKING = "ASKING",
    RECORDING = "RECORDING",
    PROCESSING = "PROCESSING",
    FINISHED = "FINISHED",
}

const Agent = ({
                   userName,
                   userId,
                   profileImage,
                   interviewId,
                   feedbackId,
                   type,
                   questions = [],
               }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<string>("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const askQuestion = async (question: string) => {
        setCallStatus(CallStatus.ASKING);
        setLastMessage(question);
        const assistantMessage: SavedMessage = {
            role: "assistant",
            content: question,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        await playTextWithElevenLabs(question);
        startRecording();
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            setCallStatus(CallStatus.PROCESSING);
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            const buffer = await audioBlob.arrayBuffer();

            const transcript = await transcribeAudio(Buffer.from(buffer));
            const userMessage: SavedMessage = { role: "user", content: transcript };
            setMessages((prev) => [...prev, userMessage]);

            const assistantReply = await getAssistantResponse(transcript);
            const assistantResponseMessage: SavedMessage = {
                role: "assistant",
                content: assistantReply,
            };
            setMessages((prev) => [...prev, assistantResponseMessage]);
            setLastMessage(assistantReply);

            await playTextWithElevenLabs(assistantReply);

            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                } else {
                    setCallStatus(CallStatus.FINISHED);
                }
            }, 1000);
        };

        mediaRecorderRef.current.start();
        setCallStatus(CallStatus.RECORDING);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    const handleEnd = async () => {
        setCallStatus(CallStatus.FINISHED);

        if (type === "generate") {
            router.push("/");
        } else {
            const { success, feedbackId: id } = await createFeedback({
                interviewId: interviewId!,
                userId: userId!,
                transcript: messages,
                feedbackId,
            });

            if (success && id) {
                router.push(`/interview/${interviewId}/feedback`);
            } else {
                router.push("/");
            }
        }
    };

    useEffect(() => {
        if (callStatus === CallStatus.INACTIVE && questions.length > 0) {
            askQuestion(questions[0]);
        }
    }, []);

    useEffect(() => {
        if (currentQuestionIndex > 0 && currentQuestionIndex < questions.length) {
            askQuestion(questions[currentQuestionIndex]);
        }
    }, [currentQuestionIndex]);

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="interviewer"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src={profileImage || "/user-avatar.png"} // ✅ fallback if not provided
                            alt="user profile"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {lastMessage && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p className="animate-fadeIn">{lastMessage}</p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center mt-4 gap-4">
                {callStatus === CallStatus.RECORDING && (
                    <button className="btn-disconnect" onClick={stopRecording}>
                        Stop
                    </button>
                )}
                {callStatus === CallStatus.FINISHED && (
                    <button className="btn-disconnect" onClick={handleEnd}>
                        End Session
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;

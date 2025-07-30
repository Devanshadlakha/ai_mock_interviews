"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import {
    getInterviewById,
    getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { app } from "@/firebase/client";

interface Interview {
    id: string;
    role: string;
    type: string;
    techstack: string[];
    questions: string[];
}

const InterviewClientPage = ({ interviewId }: { interviewId: string }) => {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [interview, setInterview] = useState<Interview | null>(null);
    const [feedbackId, setFeedbackId] = useState<string | undefined>();

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push("/sign-in");
                return;
            }

            setUser(firebaseUser);

            const interviewData = await getInterviewById(interviewId);
            if (!interviewData) {
                router.push("/");
                return;
            }

            setInterview(interviewData);

            // Only destructure id if available to avoid "defined but not used" warning
            const feedbackData = await getFeedbackByInterviewId({
                interviewId,
                userId: firebaseUser.uid,
            });

            if (feedbackData?.id) {
                setFeedbackId(feedbackData.id);
            }
        });

        return () => unsubscribe();
    }, [interviewId, router]);

    if (!user || !interview) return <p>Loading...</p>;

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={getRandomInterviewCover()}
                            alt="cover-image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                        />
                        <h3 className="capitalize">{interview.role} Interview</h3>
                    </div>

                    <DisplayTechIcons techStack={interview.techstack} />
                </div>

                <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">{interview.type}</p>
            </div>

            <Agent
                userName={user.displayName ?? "Candidate"}
                userId={user.uid}
                interviewId={interview.id}
                feedbackId={feedbackId}
                type="generate"
                questions={interview.questions}
            />
        </>
    );
};

export default InterviewClientPage;


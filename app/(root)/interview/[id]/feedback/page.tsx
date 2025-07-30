
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

import {
    getFeedbackByInterviewId,
    getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getUserFromRequest } from "@/lib/auth/firebase";

interface RouteParams {
    params: {
        id: string;
    };
}

// interface CategoryScore {
//     name: string;
//     score: number;
//     comment: string;
// }

// interface FeedbackType {
//     id: string;
//     interviewId: string;
//     userId: string;
//     totalScore: number;
//     finalAssessment: string;
//     categoryScores: CategoryScore[];
//     strengths: string[];
//     areasForImprovement: string[];
//     createdAt: string;
// }

const Feedback = async ({ params }: RouteParams) => {
    const { id } = params;

    const user = await getUserFromRequest();
    if (!user) redirect("/sign-in");

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user.uid,
    });

    if (!feedback) {
        return (
            <section className="section-feedback">
                <h1 className="text-xl text-center">No feedback found for this interview.</h1>
                <div className="flex justify-center mt-4">
                    <Button>
                        <Link href="/">Back to Dashboard</Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="section-feedback space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-semibold">
                    Feedback on the <span className="capitalize">{interview.role}</span> Interview
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-sm">
                <div className="flex items-center gap-2">
                    <Image src="/star.svg" width={20} height={20} alt="star" />
                    <p>
                        Overall Impression:{" "}
                        <span className="font-bold text-primary-200">{feedback.totalScore}</span>/100
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Image src="/calendar.svg" width={20} height={20} alt="calendar" />
                    <p>{dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}</p>
                </div>
            </div>

            <hr className="border-dark-400" />

            <div>
                <p>{feedback.finalAssessment}</p>
            </div>

            <div className="space-y-3">
                <h2 className="font-semibold text-lg">Breakdown of the Interview:</h2>
                {feedback.categoryScores.map((category, index) => (
                    <div key={index}>
                        <p className="font-bold">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="font-semibold">Strengths</h3>
                <ul className="list-disc pl-5">
                    {feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-semibold">Areas for Improvement</h3>
                <ul className="list-disc pl-5">
                    {feedback.areasForImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                    ))}
                </ul>
            </div>

            <div className="flex gap-4 mt-6">
                <Button variant="secondary" className="w-full">
                    <Link href="/" className="w-full text-center">
                        Back to Dashboard
                    </Link>
                </Button>
                <Button className="w-full">
                    <Link href={`/interview/${id}`} className="w-full text-center">
                        Retake Interview
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default Feedback;

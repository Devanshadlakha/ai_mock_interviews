import dynamic from "next/dynamic";

// Lazy-load Agent only on the client
const InterviewClientPage = dynamic(() => import("./clientPage"), { ssr: false });

const InterviewPage = ({ params }: { params: { id: string } }) => {
    return <InterviewClientPage interviewId={params.id} />;
};

export default InterviewPage;

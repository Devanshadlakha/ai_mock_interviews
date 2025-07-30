import Agent from "@/components/Agent";
import { getUserFromRequest } from "@/lib/auth/firebase";
import { redirect } from "next/navigation";

// ✅ Define expected user type
interface AuthUser {
    uid: string;
    name?: string;
    picture?: string;
}

const Page = async () => {
    const user = (await getUserFromRequest()) as AuthUser | null;

    // If user is not authenticated, redirect
    if (!user) redirect("/sign-in");

    return (
        <>
            <h3>Interview generation</h3>

            <Agent
                userName={user.name ?? "Candidate"}
                userId={user.uid}
                profileImage={user.picture ?? ""}
                type="generate"
            />
        </>
    );
};

export default Page;


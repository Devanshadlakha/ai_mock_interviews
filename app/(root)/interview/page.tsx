import Agent from "@/components/Agent";
import { getUserFromRequest } from "@/lib/auth/firebase"; // ✅ new import

const Page = async () => {
    const user = await getUserFromRequest();

    return (
        <>
            <h3>Interview generation</h3>

            <Agent
                userName={user?.name ?? "Candidate"}
                userId={user?.uid}
                profileImage={user?.picture}

                type="generate"
            />
        </>
    );
};

export default Page;

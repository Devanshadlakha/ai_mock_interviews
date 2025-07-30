
import { cookies } from "next/headers";
import { auth } from "@/firebase/admin";

export async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies(); // ⛔ no `await` here!
        const session = cookieStore.get("__session");

        if (!session?.value) return false;

        const decodedToken = await auth.verifySessionCookie(session.value, true);
        return !!decodedToken;
    } catch (error) {
        console.error("Failed to verify session cookie:", error);
        return false;
    }
}




import { auth } from "firebase-admin";
import { cookies } from "next/headers";

export const getUserFromRequest = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return null;

    try {
        const decodedToken = await auth().verifyIdToken(token);
        const { uid, name, email, picture } = decodedToken;

        return {
            uid,
            name,
            email,
            profileURL: picture,
        };
    } catch (error) {
        console.error("[getUserFromRequest] Token validation failed:", error);
        return null;
    }
};


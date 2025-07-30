"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/sign-in");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}

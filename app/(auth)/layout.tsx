import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getUserFromRequest } from "@/lib/auth/firebase"; // ✅ Replaces isAuthenticated

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const user = await getUserFromRequest();

    if (user) redirect("/"); // ✅ If user is already authenticated, redirect to home

    return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;


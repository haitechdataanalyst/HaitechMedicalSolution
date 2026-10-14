"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthAlert from "./AuthAlert";

interface AuthNoticeProps {
    /** Shown when the URL has ?message=check-email. */
    checkEmail?: string;
}

function Notice({ checkEmail }: AuthNoticeProps) {
    const params = useSearchParams();
    const error = params.get("error");

    return (
        <>
            {checkEmail && params.get("message") === "check-email" && (
                <AuthAlert tone="info" className="mb-5">
                    {checkEmail}
                </AuthAlert>
            )}
            {error && (
                <AuthAlert tone="error" className="mb-5">
                    {error}
                </AuthAlert>
            )}
        </>
    );
}

/**
 * The ?message= / ?error= banners of the sign-in pages. They are read in the browser so the pages themselves can be
 * prerendered: reading searchParams on the server makes a page dynamic, and every dynamic page is one more Vercel function.
 */
export default function AuthNotice(props: AuthNoticeProps) {
    return (
        <Suspense fallback={null}>
            <Notice {...props} />
        </Suspense>
    );
}

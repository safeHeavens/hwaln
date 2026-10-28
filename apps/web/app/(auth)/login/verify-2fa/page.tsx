
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function VerifyTwoFactorPage() {
    const [code, setCode] = useState("");
    const [notice, setNotice] = useState("");

    function verifyCode(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNotice(
            "Two-factor verification isn't connected yet. The server must verify this code before granting access.",
        );
    }

    return (
        <section className="w-full max-w-[420px]">
            <Link
                href="/login/enter-password"
                className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/15 bg-emerald-200/[0.06] text-[#a8f078]">
                <ShieldCheck className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.045em]">
                Verify it’s you
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
                Enter the verification code from your authenticator app.
            </p>

            <form onSubmit={verifyCode} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="code" className="mb-2 block text-sm text-gray-300">
                        Authentication code
                    </label>
                    <input
                        id="code"
                        className="hw-input text-center text-lg tracking-[0.35em]"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={code}
                        onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                        required
                    />
                </div>

                {notice && (
                    <p role="status" className="text-sm leading-5 text-amber-100">
                        {notice}
                    </p>
                )}

                <button type="submit" className="hw-primary w-full">
                    Verify code
                </button>
            </form>

            <p className="mt-5 text-xs leading-5 text-gray-500">
                This screen should only be shown after the authentication server confirms
                that your account requires authenticator verification.
            </p>
        </section>
    );
}

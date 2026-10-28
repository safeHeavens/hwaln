
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
} from "lucide-react";

export default function EnterPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("hwaln_login_email");

        if (!savedEmail) {
            router.replace("/login");
            return;
        }

        setEmail(savedEmail);
    }, [router]);

    const showLabel = isFocused || password.length > 0;

    function submitPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNotice("");

        // Authentication is not connected yet.
        setNotice(
            "Login is not available yet. Connect the authentication API before using real accounts."
        );
    }

    return (
        <main className="relative flex items-center justify-center overflow-hidden px-5 py-5 text-[#20251f]">
            <section className="w-full">
                {/* Back navigation */}
                <Link
                    href="/login"
                    className="-mt-3 mb-7 inline-flex items-center gap-2 rounded-full border border-gray-600/25 p-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <div className="mb-5 hidden h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-[#263b2a]">
                        <LockKeyhole
                            className="h-5 w-5"
                            strokeWidth={1.8}
                        />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Enter your password
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Enter your password to log in
                    </p>

                    {email && (
                        <p className="mt-0 break-all text-sm font-semibold text-gray-700">
                            {email}
                        </p>
                    )}
                </div>

                {/* Password form */}
                <form onSubmit={submitPassword} className="space-y-5">
                    <div
                        className="relative rounded-xl border border-gray-300/70 bg-gray-100 focus-within:!border-gray-300/70 focus-within:!outline-none focus-within:!ring-0 focus-within:!shadow-none"
                        style={{
                            outline: "none",
                            boxShadow: "none",
                        }}
                    >
                        {/* Floating label */}
                        <div
                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                showLabel
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <label
                                    htmlFor="password"
                                    className="block px-4 pt-2.5 text-xs font-semibold leading-4 text-gray-500"
                                >
                                    Password
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    if (notice) setNotice("");
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                required
                                className="!m-0 block min-w-0 flex-1 appearance-none !rounded-xl !border-0 !bg-transparent px-4 py-3 text-sm leading-5 text-gray-900 !outline-none !ring-0 !shadow-none placeholder:text-gray-400 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none focus-visible:!border-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none"
                                style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    border: "none",
                                }}
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 outline-none transition-colors _hover:bg-gray-200 hover:text-gray-800 _focus-visible:ring-2 _focus-visible:ring-gray-400"
                            >
                                {showPassword ? (
                                    <EyeOff
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                ) : (
                                    <Eye
                                        size={18}
                                        strokeWidth={1.8}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Authentication status */}
                    {notice && (
                        <p
                            role="status"
                            className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-800"
                        >
                            {notice}
                        </p>
                    )}

                    {/* Password recovery */}
                    <p className="mt-1 mb-4 text-right text-sm text-gray-500">
                        <Link
                            href="/login/forgot-password"
                            className="flex-inline font-medium text-[#263b2a] transition-colors hover:text-[#344d37] underline hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </p>

                    <button
                        type="submit"
                        className="mt-7 group flex w-full items-center justify-center gap-2 rounded-xl bg-[#263b2a] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#344d37] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                    >
                        Log in
                        <ArrowRight className="hidden h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                </form>


            </section>
        </main>
    );
}

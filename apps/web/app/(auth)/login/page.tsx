
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState("");

    const showLabel = isFocused || email.length > 0;

    function continueWithEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Enter your email address to continue.");
            return;
        }

        sessionStorage.setItem("hwaln_login_email", normalizedEmail);
        router.push("/login/enter-password");
    }

    return (
        <main className="relative w-full flex flex-col items-center justify-center overflow-hidden px-5 text-[#20251f]">
            <div className="w-full flex h-auto items-start justify-between mb-10">
                <div></div>
                <div>
                    Talk with agent
                </div>
            </div>
            <section className="w-full h-full mt-10">
                <div className="mb-9 -mt-5 text-center sm:text-left">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Log in to continue to your HWALN account.
                    </p>
                </div>

                <form
                    onSubmit={continueWithEmail}
                    className="mt-8 pt-8 space-y-6"
                >
                    {/* Floating-label input */}
                    <div className="relative rounded-xl border border-[#263b2a]/20 bg-gray-100">
                        <div
                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                showLabel
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <label
                                    htmlFor="email"
                                    className="block px-4 pt-2.5 text-xs font-semibold leading-4 text-gray-500"
                                >
                                    Email or phone number
                                </label>
                            </div>
                        </div>

                        <input
                            type="text"
                            name="email"
                            id="email"
                            autoComplete="username"
                            placeholder="Enter email or phone number"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (error) setError("");
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "email-error" : undefined}
                            required
                            className="!m-0 block w-full appearance-none !rounded-xl !border-0 !bg-transparent px-4 py-3 text-sm leading-5 text-gray-900 !outline-none !ring-0 !shadow-none placeholder:text-gray-400 focus:!border-0 focus:!border-transparent focus:!bg-transparent focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none"
                        />
                    </div>

                    {error && (
                        <p
                            id="email-error"
                            role="alert"
                            className="text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#42AD72] _bg-[#263b2a] px-4 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#344d37] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                    >
                        Log In
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-gray-500">
                    New to HWALN?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-[#263b2a] transition-colors hover:text-[#344d37] hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </section>
        </main>
    );
}

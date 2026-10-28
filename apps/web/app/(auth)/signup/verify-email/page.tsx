
"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ClipboardEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, RefreshCw } from "lucide-react";

const CODE_LENGTH = 6;

export default function VerifyEmailPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState<string[]>(
        Array(CODE_LENGTH).fill("")
    );
    const [notice, setNotice] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const verificationStarted = useRef(false);

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("hwaln_signup_email") || "satoshi@gmail.com";

        if (!savedEmail) {
            router.replace("/signup");
            return;
        }

        setEmail(savedEmail);
    }, [router]);

    const verifyCode = useCallback(
        async (enteredCode: string) => {
            if (
                enteredCode.length !== CODE_LENGTH ||
                !/^\d{6}$/.test(enteredCode) ||
                verificationStarted.current
            ) {
                return;
            }

            verificationStarted.current = true;
            setIsChecking(true);
            setNotice("");
            setResendMessage("");

            try {
                const response = await fetch(
                    "/api/auth/signup/verify-email",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            code: enteredCode,
                        }),
                    }
                );

                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "That code couldn't be verified. Check it and try again."
                    );
                }

                // Continue to the password creation step.
                router.push("/signup/create-password");
            } catch (err) {
                setNotice(
                    err instanceof Error
                        ? err.message
                        : "We couldn't verify your code. Please try again."
                );
                setCode(Array(CODE_LENGTH).fill(""));
                inputRefs.current[0]?.focus();
            } finally {
                setIsChecking(false);
                verificationStarted.current = false;
            }
        },
        [email, router]
    );

    function updateCode(index: number, rawValue: string) {
        if (isChecking) return;

        const digits = rawValue.replace(/\D/g, "");

        if (!digits) {
            const nextCode = [...code];
            nextCode[index] = "";
            setCode(nextCode);
            setNotice("");
            return;
        }

        const nextCode = [...code];
        const enteredDigits = digits.slice(0, CODE_LENGTH - index);

        enteredDigits.split("").forEach((digit, offset) => {
            nextCode[index + offset] = digit;
        });

        setCode(nextCode);
        setNotice("");
        setResendMessage("");

        const completeCode = nextCode.join("");

        if (
            completeCode.length === CODE_LENGTH &&
            /^\d{6}$/.test(completeCode)
        ) {
            inputRefs.current[CODE_LENGTH - 1]?.blur();
            void verifyCode(completeCode);
            return;
        }

        const nextIndex = Math.min(
            index + enteredDigits.length,
            CODE_LENGTH - 1
        );

        inputRefs.current[nextIndex]?.focus();
    }

    function handleKeyDown(
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === "Backspace") {
            event.preventDefault();

            const nextCode = [...code];

            if (code[index]) {
                nextCode[index] = "";
                setCode(nextCode);
            } else if (index > 0) {
                nextCode[index - 1] = "";
                setCode(nextCode);
                inputRefs.current[index - 1]?.focus();
            }

            setNotice("");
            return;
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            event.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
        event.preventDefault();

        if (isChecking) return;

        const pastedDigits = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, CODE_LENGTH);

        if (!pastedDigits) return;

        const nextCode = Array(CODE_LENGTH).fill("");

        pastedDigits.split("").forEach((digit, index) => {
            nextCode[index] = digit;
        });

        setCode(nextCode);
        setNotice("");
        setResendMessage("");

        if (pastedDigits.length === CODE_LENGTH) {
            inputRefs.current[CODE_LENGTH - 1]?.blur();
            void verifyCode(pastedDigits);
        } else {
            inputRefs.current[pastedDigits.length]?.focus();
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const enteredCode = code.join("");

        if (!/^\d{6}$/.test(enteredCode)) {
            setNotice("Enter all six digits to continue.");
            return;
        }

        void verifyCode(enteredCode);
    }

    async function resendCode() {
        if (isResending || isChecking || !email) return;

        setIsResending(true);
        setResendMessage("");
        setNotice("");

        try {
            const response = await fetch(
                "/api/auth/signup/resend-code",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "We couldn't send a new code. Please try again."
                );
            }

            setCode(Array(CODE_LENGTH).fill(""));
            setResendMessage(
                data?.message || "A new verification code has been sent."
            );
            inputRefs.current[0]?.focus();
        } catch (err) {
            setResendMessage(
                err instanceof Error
                    ? err.message
                    : "We couldn't send a new code. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    }

    return (
        <main className="relative flex h-full items-center justify-center px-5 py-4 text-[#29232f]">
            <section className="w-full h-full">
                {/* Back navigation */}
                <Link
                    href="/signup"
                    aria-label="Back to signup"
                    className="mb-7 inline-flex items-center justify-center rounded-full border border-[#30233b] p-2 text-[#30233b] transition-colors hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#29232f]">
                        Check your email
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        We&apos;ve sent a 6-digit verification code to
                    </p>

                    {email && (
                        <p className="mt-1 break-all text-sm font-semibold text-[#30233b]">
                            {email}
                        </p>
                    )}
                </div>

                {/* Verification form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div
                        className="flex w-full px-4 max-w-[360px] justify-between gap-2"
                        onPaste={handlePaste}
                        aria-label="Six-digit verification code"
                    >
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete={
                                    index === 0 ? "one-time-code" : "off"
                                }
                                aria-label={`Verification digit ${index + 1}`}
                                maxLength={1}
                                value={digit}
                                disabled={isChecking}
                                onChange={(event) =>
                                    updateCode(index, event.target.value)
                                }
                                onKeyDown={(event) =>
                                    handleKeyDown(index, event)
                                }
                                className="!m-0 h-[50px] min-w-0 flex-1 appearance-none !rounded-lg !border !border-[#30233b] !bg-transparent p-0 text-center text-lg font-semibold text-[#29232f] !outline-none !ring-0 !shadow-none focus:!border-[#30233b] focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none disabled:cursor-wait disabled:opacity-60"
                                style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    borderColor: "#30233b",
                                }}
                            />
                        ))}
                    </div>

                    {/* Automatic verification status */}
                    {isChecking && (
                        <p
                            role="status"
                            className="flex items-center justify-center gap-2 text-sm text-gray-500"
                        >
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Verifying your email...
                        </p>
                    )}

                    {/* Verification error */}
                    {notice && (
                        <p
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                        >
                            {notice}
                        </p>
                    )}

                    {/* Resend status */}
                    {resendMessage && (
                        <p
                            role="status"
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-5 text-gray-600"
                        >
                            {resendMessage}
                        </p>
                    )}

                    {/* Manual continuation */}
                    <button
                        type="submit"
                        disabled={
                            isChecking ||
                            code.join("").length !== CODE_LENGTH
                        }
                        className="hidden flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#30233b] px-5 font-medium text-white transition-colors hover:bg-[#453450] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isChecking ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />
                                Verifying...
                            </>
                        ) : (
                            "Verify email"
                        )}
                    </button>
                </form>

                {/* Resend code */}
                <div className="mt-7 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-gray-500">
                    <span>Didn&apos;t receive a code?</span>

                    <button
                        type="button"
                        onClick={resendCode}
                        disabled={isResending || isChecking}
                        className="font-semibold text-[#30233b] underline underline-offset-4 transition-colors hover:text-[#453450] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Resend code"}
                    </button>
                </div>
            </section>
        </main>
    );
}

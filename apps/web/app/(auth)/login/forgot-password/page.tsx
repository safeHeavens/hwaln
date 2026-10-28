
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
import { ArrowLeft, RefreshCw } from "lucide-react";

const CODE_LENGTH = 6;

export default function ResetPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState<string[]>(
        Array(CODE_LENGTH).fill("")
    );
    const [notice, setNotice] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const verificationStarted = useRef(false);

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("hwaln_login_email");

        if (!savedEmail) {
            router.replace("/login");
            return;
        }

        setEmail(savedEmail);
    }, [router]);

    const verifyCode = useCallback(async (enteredCode: string) => {
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
            // TODO: Replace this placeholder with your verification API.
            // The code must be verified by the server before continuing.
            await new Promise((resolve) => setTimeout(resolve, 500));

            setNotice(
                "Code verification is not connected yet. Connect your authentication API to verify this code."
            );
        } catch {
            setNotice(
                "We couldn't verify your code. Please try again."
            );
        } finally {
            setIsChecking(false);
            verificationStarted.current = false;
        }
    }, []);

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

            if (code[index]) {
                const nextCode = [...code];
                nextCode[index] = "";
                setCode(nextCode);
            } else if (index > 0) {
                const nextCode = [...code];
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

    function resendCode() {
        setResendMessage(
            "Code resending is not connected yet. Connect your authentication API to request a new code."
        );
    }

    return (
        <main className="relative flex items-center justify-center overflow-hidden px-5 py-5 text-[#20251f]">
            <section className="w-full">
                {/* Back navigation */}
                <Link
                    href="/login/enter-password"
                    aria-label="Go back"
                    className="-mt-3 mb-7 inline-flex items-center justify-center rounded-full border border-gray-600/25 p-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Check your email
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Enter the 6-digit verification code sent to
                    </p>

                    {email && (
                        <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                            {email}
                        </p>
                    )}
                </div>

                {/* Verification form */}
                <form onSubmit={handleSubmit} className="space-y-5 px-4">
                    <div
                        className="flex justify-start gap-2"
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
                                className="!m-0 h-15 w-13 shrink-0 appearance-none !rounded-lg !border !border-gray-300/70 !bg-gray-100 p-0 text-center text-base font-semibold text-gray-900 !outline-none !ring-0 !shadow-none focus:!border-gray-300/70 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none focus-visible:!border-gray-300/70 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none disabled:cursor-wait disabled:opacity-60"
                                style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    borderColor: "#d1d5db",
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
                            Checking code...
                        </p>
                    )}

                    {/* Verification notice */}
                    {notice && (
                        <p
                            role="status"
                            className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-800"
                        >
                            {notice}
                        </p>
                    )}

                    {/* Resend notice */}
                    {resendMessage && (
                        <p
                            role="status"
                            className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-5 text-gray-600"
                        >
                            {resendMessage}
                        </p>
                    )}
                </form>

                {/* Resend code */}
                <p className="mt-7 flex items-center justify-start text-center text-sm text-gray-500">
                    Didn&apos;t receive a code? Check your spam folder or {" "}</p>

                    <button
                        type="button"
                        onClick={resendCode}
                        className="ml-1 cursor-pointer font-semibold text-[#263b2a] underline transition-colors hover:text-[#344d37]"
                    >
                         Resend code
                    </button>

            </section>
        </main>
    );
}

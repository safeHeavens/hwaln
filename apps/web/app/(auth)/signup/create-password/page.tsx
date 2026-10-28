
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    X,
} from "lucide-react";

const PASSWORD_REQUIREMENTS = [
    {
        label: "At least 8 characters",
        test: (value: string) => value.length >= 8,
    },
    {
        label: "One uppercase letter",
        test: (value: string) => /[A-Z]/.test(value),
    },
    {
        label: "One lowercase letter",
        test: (value: string) => /[a-z]/.test(value),
    },
    {
        label: "One number",
        test: (value: string) => /\d/.test(value),
    },
];

function FloatingPasswordField({
                                   id,
                                   label,
                                   value,
                                   onChange,
                                   showPassword,
                                   onTogglePassword,
                                   disabled = false,
                                   error = false,
                               }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    showPassword: boolean;
    onTogglePassword: () => void;
    disabled?: boolean;
    error?: boolean;
}) {
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0;

    return (
        <div className="relative w-full">
            <input
                id={id}
                name={id}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=" "
                autoComplete="new-password"
                disabled={disabled}
                aria-invalid={error}
                className={`!m-0 h-[56px] w-full min-w-0 !rounded-lg !border !bg-transparent px-4 pr-12 text-base text-[#29232f] !outline-none !ring-0 !shadow-none placeholder:text-transparent focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none disabled:cursor-wait disabled:opacity-60 ${
                    floating ? "pb-1 pt-5" : "py-3"
                } ${
                    error
                        ? "!border-red-700"
                        : "!border-[#30233b] focus:!border-[#30233b]"
                }`}
            />

            <label
                htmlFor={id}
                className={`pointer-events-none absolute left-4 z-[1] text-[#756d7d] transition-all duration-150 ease-out ${
                    floating
                        ? "top-[9px] translate-y-0 text-[11px] font-medium"
                        : "top-1/2 -translate-y-1/2 text-sm"
                }`}
            >
                {label}
            </label>

            <button
                type="button"
                onClick={onTogglePassword}
                disabled={disabled}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls={id}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756d7d] !outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!shadow-none disabled:opacity-60"
            >
                {showPassword ? (
                    <EyeOff size={19} strokeWidth={1.8} />
                ) : (
                    <Eye size={19} strokeWidth={1.8} />
                )}
            </button>
        </div>
    );
}

export default function CreatePasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [email] = useState(() =>
        typeof window !== "undefined"
            ? window.sessionStorage.getItem("hwaln_signup_email") || ""
            : ""
    );

    const requirements = PASSWORD_REQUIREMENTS.map((requirement) => ({
        label: requirement.label,
        valid: requirement.test(password),
    }));

    const passwordIsValid = requirements.every(
        (requirement) => requirement.valid
    );

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!email) {
            setError("Your signup session has expired. Please start again.");
            return;
        }

        if (!passwordIsValid) {
            setError("Please meet all password requirements.");
            return;
        }

        if (!passwordsMatch) {
            setError("Your passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "/api/auth/signup/create-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    data?.message ||
                    "We couldn't create your password. Please try again."
                );
                return;
            }

            router.push("/signup/complete-profile");
        } catch {
            setError(
                "Unable to connect. Check your internet connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-full w-full items-center justify-center px-5 py-8 sm:px-8 sm:py-10">
            <section className="w-full max-w-[420px]">
                <Link
                    href="/signup/verify-email"
                    aria-label="Back to email verification"
                    className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#30233b] text-[#30233b] !outline-none !ring-0 !shadow-none transition-colors hover:bg-[#f5f2f7] focus:!outline-none focus:!ring-0 focus:!shadow-none"
                >
                    <ArrowLeft size={19} strokeWidth={1.8} />
                </Link>

                <div className="mb-8">

                    <h1 className="text-[28px] font-semibold tracking-tight text-[#29232f] sm:text-[32px]">
                        Set your password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#756d7d]">
                        Choose a strong password to secure your HWALN account.
                    </p>

                    {email && (
                        <p className="mt-3 break-all text-sm font-medium text-[#30233b]">
                            {email}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-7">
                        <div>
                            <FloatingPasswordField
                                id="password"
                                label="Create password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    setError("");
                                }}
                                showPassword={showPassword}
                                onTogglePassword={() =>
                                    setShowPassword((current) => !current)
                                }
                                disabled={isSubmitting}
                            />

                            <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                                {requirements.map((requirement) => (
                                    <div
                                        key={requirement.label}
                                        className="flex items-center gap-2 text-xs leading-5"
                                    >
                                        {requirement.valid ? (
                                            <Check
                                                size={14}
                                                className="shrink-0 text-emerald-700"
                                            />
                                        ) : (
                                            <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center">
                                                <span className="h-1 w-1 rounded-full bg-[#8c8492]" />
                                            </span>
                                        )}

                                        <span
                                            className={
                                                requirement.valid
                                                    ? "text-emerald-800"
                                                    : "text-[#756d7d]"
                                            }
                                        >
                                            {requirement.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <FloatingPasswordField
                                id="confirmPassword"
                                label="Confirm password"
                                value={confirmPassword}
                                onChange={(value) => {
                                    setConfirmPassword(value);
                                    setError("");
                                }}
                                showPassword={showConfirmPassword}
                                onTogglePassword={() =>
                                    setShowConfirmPassword(
                                        (current) => !current
                                    )
                                }
                                disabled={isSubmitting}
                                error={
                                    confirmPassword.length > 0 &&
                                    !passwordsMatch
                                }
                            />

                            {confirmPassword.length > 0 && (
                                <p
                                    className={`mt-3 flex items-center gap-1.5 text-xs leading-5 ${
                                        passwordsMatch
                                            ? "text-emerald-800"
                                            : "text-[#756d7d]"
                                    }`}
                                >
                                    {passwordsMatch ? (
                                        <Check size={14} />
                                    ) : (
                                        <X size={14} />
                                    )}

                                    {passwordsMatch
                                        ? "Passwords match"
                                        : "Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="text-sm leading-5 text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !passwordIsValid ||
                                !passwordsMatch
                            }
                            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-lg bg-[#30233b] px-5 text-sm font-semibold text-white !outline-none !ring-0 !shadow-none transition-opacity hover:opacity-90 focus:!outline-none focus:!ring-0 focus:!shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Creating password...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </div>
                </form>

            </section>
        </main>
    );
}

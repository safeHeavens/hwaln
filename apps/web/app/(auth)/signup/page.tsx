
"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ChartNoAxesCombined,
    ChevronDown,
    LoaderCircle,
    Check,
} from "lucide-react";

const countries = [
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", flag: "🇬🇭" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
];

export default function SignUpPage() {
    const router = useRouter();
    const countryRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("NG");
    const [countryOpen, setCountryOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedCountry =
        countries.find((item) => item.code === country) ?? countries[0];

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                countryRef.current &&
                !countryRef.current.contains(event.target as Node)
            ) {
                setCountryOpen(false);
            }
        }

        function handleEscape(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape") {
                setCountryOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleCountryKeyDown(
        event: KeyboardEvent<HTMLButtonElement>
    ) {
        if (
            !countryOpen &&
            (event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " ")
        ) {
            event.preventDefault();
            setCountryOpen(true);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/signup/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    country,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "We couldn't start your signup. Please try again."
                );
            }

            router.push("/signup/verify-email");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <header className="lg:min-h-[60px]">
                {/* add header stuffs like chat assist */}
            </header>
            <section>
                <div className="mb-10">
                    <h1 className="text-2xl lg:text-3xl uppercase font-extrabold text-center">
                        Welcome to HWALN
                    </h1>

                    <p className="text-md text-gray-600 text-center mt-2 lg:px-8">
                        Discover forex and crypto — with expert strategies you can follow, on your terms.
                    </p>
                </div>

                {/* Signup form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Floating-label email */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                placeholder=" "
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    if (error) setError("");
                                }}
                                required
                                disabled={loading}
                                className="peer h-[58px] w-full rounded-xl border border-[#30233b] bg-transparent px-4 pb-1 pt-5 text-base text-[#29232f] outline-none !shadow-none transition-none placeholder:text-transparent focus:!border-[#30233b] focus:!outline-none focus:!ring-0 focus:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!shadow-none active:!shadow-none disabled:opacity-60"
                            />

                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 origin-left text-[15px] font-semibold text-[#85808a] transition-all duration-150 peer-focus:top-[7px] peer-focus:translate-y-0 peer-focus:scale-[0.78] peer-focus:text-[#30233b] peer-[:not(:placeholder-shown)]:top-[7px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-[0.78]"
                            >
                                Email address
                            </label>
                        </div>
                    </div>

                    {/* Custom country dropdown */}
                    <div className="space-y-2">
                        <label
                            htmlFor="country-selector"
                            className="block text-sm font-medium text-[#29232f]"
                        >
                            Country of residence
                        </label>

                        <div ref={countryRef} className="relative">
                            <button
                                id="country-selector"
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={countryOpen}
                                aria-label={`Country of residence: ${selectedCountry.name}`}
                                onClick={() =>
                                    setCountryOpen((open) => !open)
                                }
                                onKeyDown={handleCountryKeyDown}
                                disabled={loading}
                                className={`flex h-[58px] w-full items-center gap-3 rounded-xl border bg-transparent px-4 text-left text-base text-[#29232f] outline-none shadow-none transition-colors focus:outline-none focus:ring-0 focus:shadow-none disabled:opacity-60 ${
                                    countryOpen
                                        ? "border-[#30233b]"
                                        : "border-[#bdb9c1] hover:border-[#77717d]"
                                }`}
                            >
                                <span className="text-[22px] leading-none">
                                    {selectedCountry.flag}
                                </span>

                                <span className="flex-1">
                                    {selectedCountry.name}
                                </span>

                                <ChevronDown
                                    size={18}
                                    className={`text-[#77717d] transition-transform duration-200 ${
                                        countryOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {countryOpen && (
                                <div
                                    role="listbox"
                                    aria-label="Select country of residence"
                                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-xl border border-[#dedbe1] bg-white p-1.5 shadow-[0_8px_30px_rgba(35,25,45,0.08)]"
                                >
                                    {countries.map((item) => {
                                        const selected = item.code === country;

                                        return (
                                            <button
                                                key={item.code}
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                onClick={() => {
                                                    setCountry(item.code);
                                                    setCountryOpen(false);
                                                }}
                                                className={`flex min-h-[46px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors focus:outline-none focus:ring-0 ${
                                                    selected
                                                        ? "bg-[#f2f0f4] text-[#30233b]"
                                                        : "text-[#49434f] hover:bg-[#f7f6f8]"
                                                }`}
                                            >
                                                <span className="text-xl leading-none">
                                                    {item.flag}
                                                </span>

                                                <span className="flex-1">
                                                    {item.name}
                                                </span>

                                                {selected && (
                                                    <Check
                                                        size={17}
                                                        className="text-[#30233b]"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <p className="hidden text-xs leading-5 text-[#85808a]">
                            Your country helps determine the services and
                            verification requirements available to you.
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="mt-10 group flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#65cf21] _bg-[#30233b] px-5 font-medium text-white transition-colors hover:bg-[#499419] _hover:bg-[#453450] focus:outline-none focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />
                                Getting things ready...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </>
                        )}
                    </button>
                </form>
            </section>
        </>
    );
}

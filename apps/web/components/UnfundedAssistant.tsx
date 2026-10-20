
"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowUp,
    Bot,
    CircleHelp,
    Compass,
    LoaderCircle,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const suggestions = [
    {
        label: "How does copy trading work?",
        icon: CircleHelp,
        prompt:
            "Explain how copy trading works on HWALN, including how funds and risk are managed.",
    },
    {
        label: "Explore trading discover",
        icon: Compass,
        prompt:
            "Help me understand how to evaluate a trading expert before copying their trades.",
    },
    {
        label: "Understand the risks",
        icon: ShieldCheck,
        prompt:
            "What are the main risks of forex and crypto copy trading, and how can I manage them?",
    },
];

const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content:
        "Hey, welcome to HWALN. 👋\n\nI'm here to help you understand copy trading, explore trading discover, and learn about risk before you get started.\n\nWhat would you like to explore first?",
};

export default function UnfundedAssistant() {
    const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, isLoading]);

    async function sendMessage(text = input) {
        const content = text.trim();

        if (!content || isLoading || content.length > 2000) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content,
        };

        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/assistant/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages
                        .filter((message) => message.id !== "welcome")
                        .slice(-12)
                        .map(({ role, content: messageContent }) => ({
                            role,
                            content: messageContent,
                        })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : "I couldn't respond just now. Please try again."
                );
            }

            if (typeof data.reply !== "string" || !data.reply.trim()) {
                throw new Error("I received an empty response. Please try again.");
            }

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.reply,
                },
            ]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }

    return (
        <section className="hidden mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-white/[0.08] dark:bg-[#101A20] sm:mt-6 sm:rounded-3xl">

        </section>
    );
}

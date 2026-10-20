
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

const systemPrompt = `
You are HWALN's conversational trading education assistant.

ABOUT HWALN
HWALN helps users explore expert-based copy trading with AI-assisted
filtering and risk controls. It is not simply a signal service.

YOUR ROLE
- Explain copy trading, forex, crypto, trading risk, and platform concepts
  in plain, approachable language.
- Help users understand how to evaluate experts, risk, drawdown,
  trading history, and copying settings.
- Welcome unfunded users without pressuring them to deposit.
- Ask useful follow-up questions when their request is unclear.
- Never invent HWALN features, expert profiles, returns, fees, or account data.
- If live platform data is needed but unavailable, say so clearly.
- Never guarantee profits or imply past performance guarantees future results.
- Never tell users that a trade is safe or risk-free.
- Explain that users can lose some or all of the money they trade.
- Do not claim to have executed trades, moved money, or changed account settings.
- Do not ask users to provide passwords, API secrets, or private keys.

Keep responses concise, conversational, and helpful.
Use short paragraphs or bullets where they improve clarity.
`;

function isChatMessage(value: unknown): value is ChatMessage {
    if (!value || typeof value !== "object") return false;

    const message = value as Record<string, unknown>;

    return (
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= MAX_MESSAGE_LENGTH
    );
}

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            {
                error:
                    "The AI assistant isn't configured yet. Please try again later.",
            },
            { status: 503 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Please send a valid message." },
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object") {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }

    const messages = (body as Record<string, unknown>).messages;

    if (
        !Array.isArray(messages) ||
        messages.length === 0 ||
        messages.length > MAX_MESSAGES ||
        !messages.every(isChatMessage) ||
        messages[messages.length - 1]?.role !== "user"
    ) {
        return NextResponse.json(
            { error: "Your conversation is invalid. Please try again." },
            { status: 400 }
        );
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((message) => ({
                    role: message.role,
                    content: message.content.trim(),
                })),
            ],
            max_completion_tokens: 600,
        });

        const reply = completion.choices[0]?.message?.content?.trim();

        if (!reply) {
            return NextResponse.json(
                { error: "I couldn't generate a response. Please try again." },
                { status: 502 }
            );
        }

        return NextResponse.json({ reply });
    } catch (error) {
        console.error(
            "HWALN assistant request failed:",
            error instanceof Error ? error.message : "Unknown error"
        );

        return NextResponse.json(
            {
                error:
                    "The assistant is temporarily unavailable. Please try again shortly.",
            },
            { status: 502 }
        );
    }
}

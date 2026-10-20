import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const tradeStatus = pgEnum("trade_status", [
    "detected",
    "approved",
    "reduced",
    "rejected",
    "executed",
    "failed",
]);

export const experts = pgTable("experts", {
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: text("display_name").notNull(),
    strategyDescription: text("strategy_description"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", {
        withTimezone: true,
    }).notNull().defaultNow(),
});

export const tradeEvents = pgTable("trade_events", {
    id: uuid("id").defaultRandom().primaryKey(),
    expertId: uuid("expert_id")
        .notNull()
        .references(() => experts.id),
    instrument: text("instrument").notNull(),
    direction: text("direction").notNull(),
    status: tradeStatus("status").notNull().default("detected"),
    filterReason: text("filter_reason"),
    detectedAt: timestamp("detected_at", {
        withTimezone: true,
    }).notNull().defaultNow(),
});
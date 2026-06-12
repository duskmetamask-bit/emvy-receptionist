import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calls: defineTable({
    callId: v.string(),           // Retell call ID
    callerNumber: v.string(),     // Caller phone number
    callerName: v.optional(v.string()),
    duration: v.number(),         // seconds
    outcome: v.union(
      v.literal("answered"),
      v.literal("voicemail"),
      v.literal("missed")
    ),
    summary: v.optional(v.string()),
    transcript: v.optional(v.string()),
    booked: v.boolean(),
    createdAt: v.number(),        // Unix ms timestamp
  }).index("by_createdAt", ["createdAt"])
    .index("by_outcome", ["outcome"]),

  bookings: defineTable({
    callId: v.string(),
    callerName: v.string(),
    callerPhone: v.string(),
    dayOfWeek: v.number(),        // 0=Sun, 6=Sat
    timeSlot: v.string(),         // "09:00", "09:30", etc.
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_dayOfWeek", ["dayOfWeek"]),

  availability: defineTable({
    dayOfWeek: v.number(),        // 0=Sun, 6=Sat
    timeSlot: v.string(),        // "09:00", "09:30", etc.
    enabled: v.boolean(),
  }).index("by_dayOfWeek", ["dayOfWeek"]),
});

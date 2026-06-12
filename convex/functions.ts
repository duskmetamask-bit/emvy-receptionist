import { query, mutation } from "./_generated";
import { v } from "convex/values";

// ── Calls ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("calls")
      .order("desc")
      .take(100);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("calls").collect();
    const answered = all.filter(c => c.outcome === "answered").length;
    const voicemail = all.filter(c => c.outcome === "voicemail").length;
    const missed = all.filter(c => c.outcome === "missed").length;
    const booked = all.filter(c => c.booked).length;
    return { total: all.length, answered, voicemail, missed, booked };
  },
});

export const createCall = mutation({
  args: {
    callId: v.string(),
    callerNumber: v.string(),
    callerName: v.optional(v.string()),
    duration: v.number(),
    outcome: v.union(v.literal("answered"), v.literal("voicemail"), v.literal("missed")),
    summary: v.optional(v.string()),
    transcript: v.optional(v.string()),
    booked: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("calls")
      .withIndex("by_createdAt")
      .filter(q => q.eq(q.field("callId"), args.callId))
      .first();
    if (existing) return existing._id;
    return ctx.db.insert("calls", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ── Bookings ────────────────────────────────────────────────────────────────

export const listBookings = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("bookings")
      .order("desc")
      .take(100);
  },
});

export const createBooking = mutation({
  args: {
    callId: v.string(),
    callerName: v.string(),
    callerPhone: v.string(),
    dayOfWeek: v.number(),
    timeSlot: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("bookings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ── Availability ────────────────────────────────────────────────────────────

export const listAvailability = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("availability")
      .order("asc")
      .collect();
  },
});

export const upsertAvailability = mutation({
  args: {
    dayOfWeek: v.number(),
    timeSlot: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("availability")
      .withIndex("by_dayOfWeek", q => q.eq(q.field("dayOfWeek"), args.dayOfWeek))
      .filter(q => q.eq(q.field("timeSlot"), args.timeSlot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { enabled: args.enabled });
      return existing._id;
    }
    return ctx.db.insert("availability", args);
  },
});

export const seedAvailability = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing
    const all = await ctx.db.query("availability").collect();
    await Promise.all(all.map(r => ctx.db.delete(r._id)));

    // Seed Mon-Fri 9am-5pm every 30 min
    const days = [1, 2, 3, 4, 5]; // Mon-Fri
    const slots = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];
    for (const day of days) {
      for (const slot of slots) {
        await ctx.db.insert("availability", { dayOfWeek: day, timeSlot: slot, enabled: true });
      }
    }
  },
});

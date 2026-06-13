"use client";

import { useQuery } from "convex/react";
import { Calendar } from "lucide-react";

const api = {
  bookings: {
    listBookings: "bookings:listBookings" as const,
    createBooking: "bookings:createBooking" as const,
  },
} as any;

interface Booking {
  _id: string;
  callId: string;
  callerName: string;
  callerPhone: string;
  dayOfWeek: number;
  timeSlot: string;
  notes?: string;
  createdAt: number;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(dayOfWeek: number, timeSlot: string): string {
  const now = new Date();
  const todayDow = now.getDay();
  let daysUntil = dayOfWeek - todayDow;
  if (daysUntil < 0) daysUntil += 7;
  if (daysUntil === 0) daysUntil = 7;
  const date = new Date(now);
  date.setDate(now.getDate() + daysUntil);
  return `${dayNames[dayOfWeek]} ${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString("en-AU", { month: "short" })} at ${timeSlot}`;
}

export default function BookingsPage() {
  const bookings = useQuery(api.bookings.listBookings) as Booking[] | undefined;
  const loading = bookings === undefined;

  return (
    <div className="min-h-screen px-6 py-6" style={{ background: "var(--canvas)" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-xl"
          style={{ color: "var(--text-primary)", fontWeight: 590, letterSpacing: "-0.025em" }}
        >
          Bookings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Appointments booked through your AI Receptionist
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", val: loading ? "—" : bookings.length, accent: false },
          { label: "This Week", val: "—", accent: false },
          { label: "Confirmed", val: loading ? "—" : bookings.length, accent: true },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg px-4 py-3"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)", fontWeight: 510, letterSpacing: "0.06em", fontSize: 11 }}
            >
              {s.label}
            </div>
            <div
              className="text-3xl"
              style={{
                color: s.accent ? "#10b981" : "var(--text-primary)",
                fontWeight: 510,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        {loading ? (
          <div className="py-16 text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Loading...
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Calendar size={28} style={{ color: "var(--text-subtle)", margin: "0 auto" }} />
            <p style={{ color: "var(--text-primary)", fontWeight: 510, fontSize: 14 }}>
              No bookings yet
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Bookings will appear here when callers confirm an appointment.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Caller", "Phone", "Appointment", "Notes"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left"
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 510,
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  className="transition-colors duration-100"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          background: "rgba(94,106,210,0.15)",
                          color: "#828fff",
                          fontWeight: 590,
                          fontSize: 12,
                        }}
                      >
                        {b.callerName.charAt(0).toUpperCase()}
                      </div>
                      <span
                        style={{
                          color: "var(--text-primary)",
                          fontSize: 13,
                          fontWeight: 510,
                        }}
                      >
                        {b.callerName}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--text-muted)", fontSize: 13 }}
                  >
                    {b.callerPhone}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5" style={{ color: "var(--text-primary)", fontSize: 13 }}>
                      <Calendar size={11} style={{ color: "var(--text-muted)" }} />
                      {formatDate(b.dayOfWeek, b.timeSlot)}
                    </div>
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: b.notes ? "var(--text-muted)" : "var(--text-subtle)", fontSize: 12 }}
                  >
                    {b.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

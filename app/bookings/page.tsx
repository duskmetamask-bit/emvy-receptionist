"use client";

import { useQuery, useMutation } from "convex/react";
import { Calendar, CheckCircle } from "lucide-react";

// Convex codegen not available — use string paths with any cast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = { bookings: { listBookings: "bookings:listBookings", createBooking: "bookings:createBooking" } } as any;

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          Bookings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
          Appointments booked through your AI Receptionist
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--secondary-foreground)" }}>Total</div>
          <div className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{loading ? "—" : bookings.length}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--secondary-foreground)" }}>This Week</div>
          <div className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>—</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--secondary-foreground)" }}>Confirmed</div>
          <div className="text-2xl font-bold" style={{ color: "#4ADE80" }}>{loading ? "—" : bookings.length}</div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: "var(--secondary-foreground)" }}>Loading...</div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar size={32} style={{ color: "var(--muted-foreground)" }} className="mx-auto" />
            <div>
              <p className="font-medium" style={{ color: "var(--foreground)" }}>No bookings yet</p>
              <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
                Bookings will appear here when callers confirm an appointment.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Caller", "Phone", "Appointment", "Notes"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--secondary-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {bookings.map((b) => (
                <tr key={b._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                        style={{ background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
                        {b.callerName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{b.callerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--secondary-foreground)" }}>{b.callerPhone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--foreground)" }}>
                      <Calendar size={12} style={{ color: "var(--secondary-foreground)" }} />
                      {formatDate(b.dayOfWeek, b.timeSlot)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--secondary-foreground)" }}>
                    {b.notes || <span style={{ color: "var(--muted-foreground)" }}>—</span>}
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

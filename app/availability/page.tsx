"use client";

import { useQuery, useMutation } from "convex/react";
import { Clock, RotateCcw } from "lucide-react";

interface Availability {
  _id: string;
  dayOfWeek: number;
  timeSlot: string;
  enabled: boolean;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const allSlots = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30",
];

export default function AvailabilityPage() {
  const availability = useQuery("availability:listAvailability") as Availability[] | undefined;
  const upsertAvailability = useMutation("availability:upsertAvailability");
  const seedAvailability = useMutation("availability:seedAvailability");
  const loading = availability === undefined;

  function isEnabled(day: number, slot: string): boolean {
    return (availability ?? []).some(
      (a) => a.dayOfWeek === day && a.timeSlot === slot && a.enabled
    );
  }

  async function toggle(day: number, slot: string) {
    const enabled = !isEnabled(day, slot);
    await upsertAvailability({ dayOfWeek: day, timeSlot: slot, enabled });
  }

  async function handleSeed() {
    await seedAvailability({});
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Availability
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
            Set your AI Receptionist appointment windows
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <RotateCcw size={13} />
          Mon–Fri 9am–5pm
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: "var(--secondary-foreground)" }}>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="w-20 px-3 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--secondary-foreground)" }}>Time</th>
                  {dayNames.map((d) => (
                    <th key={d} className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wide"
                      style={{ color: "var(--secondary-foreground)" }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSlots.map((slot) => (
                  <tr key={slot} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="px-3 py-2 text-xs font-mono" style={{ color: "var(--secondary-foreground)" }}>
                      {slot}
                    </td>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <td key={day} className="px-2 py-2 text-center">
                        <button
                          onClick={() => toggle(day, slot)}
                          className="w-7 h-7 rounded-md flex items-center justify-center mx-auto transition-all duration-150"
                          style={{
                            background: isEnabled(day, slot)
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isEnabled(day, slot) ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: isEnabled(day, slot) ? "#4ADE80" : "var(--muted-foreground)" }}
                          />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        Click any cell to toggle. Green = active booking window.
      </p>
    </div>
  );
}

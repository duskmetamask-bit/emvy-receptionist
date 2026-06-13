"use client";

import { useQuery, useMutation } from "convex/react";
import { RotateCcw } from "lucide-react";

const api = {
  availability: {
    listAvailability: "availability:listAvailability" as const,
    upsertAvailability: "availability:upsertAvailability" as const,
    seedAvailability: "availability:seedAvailability" as const,
  },
} as any;

interface Availability {
  _id: string;
  dayOfWeek: number;
  timeSlot: string;
  enabled: boolean;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const allSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

export default function AvailabilityPage() {
  const availability = useQuery(api.availability.listAvailability) as Availability[] | undefined;
  const upsertAvailability = useMutation(api.availability.upsertAvailability);
  const seedAvailability = useMutation(api.availability.seedAvailability);
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
    <div className="min-h-screen px-6 py-6" style={{ background: "var(--canvas)" }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl"
            style={{ color: "var(--text-primary)", fontWeight: 590, letterSpacing: "-0.025em" }}
          >
            Availability
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Set your AI Receptionist appointment windows
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-100"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-standard)",
            fontWeight: 510,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          <RotateCcw size={11} />
          Mon–Fri 9am–5pm
        </button>
      </div>

      {/* Grid */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        {loading ? (
          <div className="py-16 text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th
                    className="w-20 px-3 py-2.5 text-left"
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 510,
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Time
                  </th>
                  {dayNames.map((d) => (
                    <th
                      key={d}
                      className="px-2 py-2.5 text-center"
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 510,
                        fontSize: 10,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSlots.map((slot) => (
                  <tr
                    key={slot}
                    style={{ borderBottom: allSlots.indexOf(slot) === allSlots.length - 1 ? "none" : "1px solid var(--border-subtle)" }}
                  >
                    <td
                      className="px-3 py-1.5"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        fontWeight: 400,
                      }}
                    >
                      {slot}
                    </td>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <td key={day} className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => toggle(day, slot)}
                          className="w-full aspect-square rounded-md flex items-center justify-center mx-auto transition-all duration-100 max-w-[36px]"
                          style={{
                            background: isEnabled(day, slot)
                              ? "rgba(16,185,129,0.15)"
                              : "rgba(255,255,255,0.03)",
                            border: `1px solid ${
                              isEnabled(day, slot)
                                ? "rgba(16,185,129,0.3)"
                                : "var(--border-subtle)"
                            }`,
                          }}
                          onMouseEnter={(e) => {
                            if (!isEnabled(day, slot))
                              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isEnabled(day, slot))
                              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          }}
                        >
                          <div
                            className="rounded-full"
                            style={{
                              width: 6,
                              height: 6,
                              background: isEnabled(day, slot) ? "#10b981" : "var(--text-subtle)",
                            }}
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

      <p
        className="mt-3"
        style={{ color: "var(--text-subtle)", fontSize: 11 }}
      >
        Click any cell to toggle. Green = active booking window.
      </p>
    </div>
  );
}

"use client";

import { useQuery } from "convex/react";
import {
  PhoneIncoming, Voicemail, PhoneOutgoing, CheckCircle, Phone,
} from "lucide-react";

const api = {
  calls: { list: "calls:list" as const, getStats: "calls:getStats" as const },
} as any;

interface Call {
  _id: string;
  callId: string;
  callerNumber: string;
  callerName?: string;
  outcome: "answered" | "voicemail" | "missed";
  duration: number;
  booked: boolean;
  createdAt: number;
}
interface Stats {
  total: number;
  answered: number;
  voicemail: number;
  missed: number;
  booked: number;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString("en-AU", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

const outcomeConfig = {
  answered: { label: "Answered", icon: PhoneIncoming, cls: "badge-answered" },
  voicemail: { label: "Voicemail", icon: Voicemail, cls: "badge-voicemail" },
  missed: { label: "Missed", icon: PhoneOutgoing, cls: "badge-missed" },
};

const statCards = [
  { key: "total", label: "Total Calls" },
  { key: "answered", label: "Answered" },
  { key: "voicemail", label: "Voicemail" },
  { key: "booked", label: "Booked" },
];

export default function CallsPage() {
  const calls = useQuery(api.calls.list) as Call[] | undefined;
  const stats = useQuery(api.calls.getStats) as Stats | undefined;
  const loading = calls === undefined || stats === undefined;

  return (
    <div
      className="min-h-screen px-6 py-6"
      style={{ background: "var(--canvas)" }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl"
            style={{
              color: "var(--text-primary)",
              fontWeight: 590,
              letterSpacing: "-0.025em",
            }}
          >
            Call Log
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-muted)", fontSize: 13 }}
          >
            All inbound calls to your AI Receptionist
          </p>
        </div>
        {/* Live badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <span
            style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 510 }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {statCards.map((s) => {
          const val = stats?.[s.key as keyof Stats] ?? 0;
          return (
            <div
              key={s.key}
              className="rounded-lg px-4 py-3"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="text-xs uppercase tracking-wider mb-2"
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 510,
                  letterSpacing: "0.06em",
                  fontSize: 11,
                }}
              >
                {s.label}
              </div>
              <div
                className="text-3xl"
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 510,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {loading ? "—" : val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calls table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {loading ? (
          <div className="py-16 text-center" style={{ color: "var(--text-muted)" }}>
            <p style={{ fontSize: 13 }}>Loading...</p>
          </div>
        ) : !calls || calls.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Phone
              size={28}
              style={{ color: "var(--text-subtle)", margin: "0 auto" }}
            />
            <p style={{ color: "var(--text-primary)", fontWeight: 510, fontSize: 14 }}>
              No calls yet
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Your AI Receptionist is ready. Calls will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Caller", "Outcome", "Duration", "Booked", "Time"].map((h) => (
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
              {calls.map((call) => {
                const cfg = outcomeConfig[call.outcome] ?? outcomeConfig.missed;
                const Icon = cfg.icon;
                return (
                  <tr
                    key={call._id}
                    className="transition-colors duration-100"
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-4 py-3">
                      <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 510 }}>
                        {call.callerName || "Unknown"}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 1 }}>
                        {call.callerNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}
                        style={{ fontWeight: 510 }}
                      >
                        <Icon size={9} />
                        {cfg.label}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--text-muted)", fontSize: 12 }}
                    >
                      {formatDuration(call.duration)}
                    </td>
                    <td className="px-4 py-3">
                      {call.booked ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium badge-booked"
                          style={{ fontWeight: 510 }}
                        >
                          <CheckCircle size={9} />
                          Booked
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--text-muted)", fontSize: 11 }}
                    >
                      {formatTime(call.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

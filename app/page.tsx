"use client";

import { useQuery } from "convex/react";
import {
  PhoneIncoming, Voicemail, PhoneOutgoing, CheckCircle,
  Phone,
} from "lucide-react";

// Convex codegen not available — use string paths with any cast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = {
  calls: {
    list: "calls:list" as const,
    getStats: "calls:getStats" as const,
  },
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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
}

const outcomeConfig = {
  answered: { label: "Answered", icon: PhoneIncoming, className: "status-called" },
  voicemail: { label: "Voicemail", icon: Voicemail, className: "status-messaged" },
  missed: { label: "Missed", icon: PhoneOutgoing, className: "status-new" },
};

const statCards = [
  { key: "total", label: "Total Calls", icon: Phone, color: "#3B82F6" },
  { key: "answered", label: "Answered", icon: PhoneIncoming, color: "#4ADE80" },
  { key: "voicemail", label: "Voicemail", icon: Voicemail, color: "#C084FC" },
  { key: "booked", label: "Booked", icon: CheckCircle, color: "#FACC15" },
];

export default function CallsPage() {
  const calls = useQuery(api.calls.list) as Call[] | undefined;
  const stats = useQuery(api.calls.getStats) as Stats | undefined;
  const loading = calls === undefined || stats === undefined;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Call Log
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
            All inbound calls to your AI Receptionist
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80" }} />
          Live
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          const val = stats?.[s.key as keyof Stats] ?? 0;
          return (
            <div
              key={s.key}
              className="rounded-xl p-4 space-y-1"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--secondary-foreground)" }}>
                  {s.label}
                </span>
                <Icon size={14} style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {loading ? "—" : val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calls table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {loading ? (
          <div className="p-12 text-center" style={{ color: "var(--secondary-foreground)" }}>
            Loading calls...
          </div>
        ) : !calls || calls.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Phone size={32} style={{ color: "var(--muted-foreground)" }} className="mx-auto" />
            <div>
              <p className="font-medium" style={{ color: "var(--foreground)" }}>No calls yet</p>
              <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
                Your AI Receptionist is ready. Calls will appear here when they come in.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Caller", "Outcome", "Duration", "Booked", "Time"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--secondary-foreground)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {calls.map((call) => {
                const cfg = outcomeConfig[call.outcome] ?? outcomeConfig.missed;
                const Icon = cfg.icon;
                return (
                  <tr key={call._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {call.callerName || "Unknown"}
                      </div>
                      <div className="text-xs" style={{ color: "var(--secondary-foreground)" }}>
                        {call.callerNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
                        <Icon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--secondary-foreground)" }}>
                      {formatDuration(call.duration)}
                    </td>
                    <td className="px-4 py-3">
                      {call.booked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80" }}>
                          <CheckCircle size={10} />
                          Booked
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--secondary-foreground)" }}>
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
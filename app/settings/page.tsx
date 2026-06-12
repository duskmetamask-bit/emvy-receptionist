"use client";

import { useState } from "react";
import { Phone, MessageSquare, Mail, Bot, ChevronRight, CheckCircle } from "lucide-react";

const sections = [
  {
    id: "retell",
    label: "Retell AI",
    icon: Bot,
    color: "#22C55E",
    fields: [
      { key: "RETELL_API_KEY", label: "API Key", placeholder: "sk_retell_..." },
      { key: "RETELL_PHONE_NUMBER", label: "Phone Number", placeholder: "+1..." },
      { key: "RETELL_AGENT_ID", label: "Agent ID", placeholder: "agent_..." },
    ],
    instructions: [
      "Create account at retellai.com",
      "Create a new agent with voice + custom prompt",
      "Set webhook URL to your n8n webhook endpoint",
      "Copy API key, phone number, and agent ID below",
    ],
  },
  {
    id: "twilio",
    label: "Twilio SMS",
    icon: MessageSquare,
    color: "#F22F46",
    fields: [
      { key: "TWILIO_ACCOUNT_SID", label: "Account SID", placeholder: "AC..." },
      { key: "TWILIO_AUTH_TOKEN", label: "Auth Token", placeholder: "..." },
      { key: "TWILIO_PHONE_NUMBER", label: "Phone Number", placeholder: "+1..." },
    ],
    instructions: [
      "Create account at twilio.com",
      "Get a phone number with SMS capability",
      "Copy Account SID, Auth Token, and phone number below",
    ],
  },
  {
    id: "gmail",
    label: "Gmail Notifications",
    icon: Mail,
    color: "#EA4335",
    fields: [
      { key: "GMAIL_USER", label: "Your Email", placeholder: "you@gmail.com" },
      { key: "GMAIL_APP_PASSWORD", label: "App Password", placeholder: "xxxx xxxx xxxx xxxx" },
    ],
    instructions: [
      "Enable 2FA on your Google account",
      "Generate an App Password at myaccount.google.com/app-passwords",
      "Use your Gmail address + the app password below",
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("retell");
  const section = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--secondary-foreground)" }}>
          Configure your AI Receptionist integrations
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 space-y-1 flex-shrink-0">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
                style={{
                  background: activeSection === s.id ? "rgba(59,130,246,0.1)" : "transparent",
                  color: activeSection === s.id ? "var(--primary)" : "var(--secondary-foreground)",
                  borderLeft: activeSection === s.id ? `2px solid var(--primary)` : "2px solid transparent",
                }}
              >
                <Icon size={14} style={{ color: activeSection === s.id ? s.color : "var(--muted-foreground)" }} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Main panel */}
        <div
          className="flex-1 rounded-xl p-6 space-y-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          {/* Section header */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${section.color}20` }}
            >
              <section.icon size={16} style={{ color: section.color }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: "var(--foreground)" }}>{section.label}</h2>
              <p className="text-xs" style={{ color: "var(--secondary-foreground)" }}>API credentials and configuration</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--secondary-foreground)" }}>
              Setup Instructions
            </p>
            {section.instructions.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(59,130,246,0.15)", color: "var(--primary)" }}
                >
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {section.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--secondary-foreground)" }}
                  htmlFor={f.key}
                >
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type="password"
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>

          <button
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Save {section.label} Settings
          </button>
        </div>
      </div>
    </div>
  );
}

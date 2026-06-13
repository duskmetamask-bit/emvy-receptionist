"use client";

import { useState } from "react";
import { Phone, MessageSquare, Mail, Bot } from "lucide-react";

const sections = [
  {
    id: "retell",
    label: "Retell AI",
    icon: Bot,
    accent: "#7170ff",
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
    accent: "#7170ff",
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
    accent: "#7170ff",
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
    <div className="min-h-screen px-6 py-6" style={{ background: "var(--canvas)" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-xl"
          style={{ color: "var(--text-primary)", fontWeight: 590, letterSpacing: "-0.025em" }}
        >
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Configure your AI Receptionist integrations
        </p>
      </div>

      <div className="flex gap-6">
        {/* Section nav */}
        <div className="w-44 flex-shrink-0 space-y-0.5">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 transition-colors duration-100"
                style={{
                  padding: "7px 8px",
                  borderRadius: 6,
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  borderLeft: isActive ? "2px solid var(--accent-bright)" : "2px solid transparent",
                  marginLeft: isActive ? 0 : 2,
                  fontSize: 13,
                  fontWeight: 510,
                  textAlign: "left",
                }}
              >
                <Icon size={13} style={{ color: isActive ? "var(--accent-bright)" : "var(--text-muted)" }} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          className="flex-1 rounded-lg px-5 py-5 space-y-5"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-subtle)",
            maxWidth: 560,
          }}
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: "rgba(113,112,255,0.1)",
                border: "1px solid rgba(113,112,255,0.15)",
              }}
            >
              <section.icon size={14} style={{ color: "var(--accent-bright)" }} />
            </div>
            <div>
              <h2
                style={{ color: "var(--text-primary)", fontWeight: 590, fontSize: 14 }}
              >
                {section.label}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                API credentials and configuration
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div
            className="rounded-lg p-4 space-y-3"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)", fontWeight: 510, letterSpacing: "0.06em", fontSize: 10 }}
            >
              Setup Instructions
            </p>
            {section.instructions.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    background: "rgba(113,112,255,0.1)",
                    color: "var(--accent-bright)",
                    fontWeight: 590,
                    fontSize: 10,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {section.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: 510,
                    letterSpacing: "0.06em",
                    fontSize: 10,
                  }}
                  htmlFor={f.key}
                >
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type="password"
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-100"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-standard)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(113,112,255,0.4)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border-standard)")
                  }
                />
              </div>
            ))}
          </div>

          {/* Save button */}
          <button
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-100"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
              fontWeight: 510,
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-bright)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            Save {section.label} Settings
          </button>
        </div>
      </div>
    </div>
  );
}

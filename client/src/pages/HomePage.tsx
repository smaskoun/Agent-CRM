import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { apiGet } from "../api";
import { MetricCard } from "../components/MetricCard";
import type { DashboardSummary } from "@shared/types";
import { useLocation } from "wouter";

export function HomePage() {
  const [, setLocation] = useLocation();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<DashboardSummary>("/api/summary")
      .then((result) => {
        setSummary(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load dashboard summary");
      });
  }, []);

  const metrics = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      {
        title: "Total contacts",
        value: summary.totalContacts.toLocaleString(),
        subtitle: "Across every pipeline",
        icon: "👥",
      },
      {
        title: "Active deals",
        value: summary.openDeals.toLocaleString(),
        subtitle: "Moving through the stages",
        icon: "📈",
      },
      {
        title: "Pipeline value",
        value: `$${summary.totalPipelineValue.toLocaleString()}`,
        subtitle: "Potential commission this quarter",
        icon: "💼",
      },
      {
        title: "Closings (30d)",
        value: summary.wonDealsThisMonth.toLocaleString(),
        subtitle: "Marked closed-won in the last month",
        icon: "🏁",
      },
      {
        title: "Avg days in pipeline",
        value: `${summary.averageDaysInPipeline} days`,
        subtitle: "From open to projected close",
        icon: "⏱️",
      },
    ];
  }, [summary]);

  return (
    <section style={{ display: "grid", gap: "2.5rem" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6366f1",
              fontWeight: 600,
            }}
          >
            Dashboard
          </p>
          <h1 style={{ margin: "0.5rem 0 0" }}>Welcome back! Here’s your real estate business overview.</h1>
          <p style={{ margin: "0.75rem 0 0", maxWidth: "640px", color: "#475569" }}>
            Keep an eye on pipeline health, upcoming client moments, and the quick actions that help you stay ahead of
            weekly targets.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="button"
            style={{
              borderRadius: "0.85rem",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "0.65rem 1rem",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Export report
          </button>
          <button
            type="button"
            style={{
              borderRadius: "0.85rem",
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              padding: "0.7rem 1.4rem",
              fontWeight: 600,
              boxShadow: "0 14px 30px rgba(99, 102, 241, 0.28)",
              cursor: "pointer",
            }}
          >
            Schedule follow-ups
          </button>
        </div>
      </header>

      {error ? (
        <p style={{ color: "tomato" }}>{error}</p>
      ) : null}

      {!summary ? (
        <p style={{ color: "#475569" }}>Loading insights…</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {metrics.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                icon={<span aria-hidden>{metric.icon}</span>}
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            <DataCard title="Today's tasks" description="No tasks due today">
              <p style={{ margin: "0 0 1rem", color: "#64748b" }}>You’re all caught up. Schedule new reminders to keep deals moving.</p>
              <button type="button" style={secondaryButtonStyle}>
                Manage tasks
              </button>
            </DataCard>
            <DataCard title="Upcoming showings" description="No upcoming showings">
              <p style={{ margin: "0 0 1rem", color: "#64748b" }}>
                Add new appointments as you confirm them with buyers to see them here.
              </p>
              <button type="button" style={secondaryButtonStyle}>
                Add showing
              </button>
            </DataCard>
            <DataCard title="Upcoming birthdays (30d)" description="No birthdays on deck">
              <p style={{ margin: "0 0 1rem", color: "#64748b" }}>
                Celebrate past clients to keep referrals flowing. Log birthdays from the contact profile.
              </p>
              <button type="button" style={secondaryButtonStyle}>
                View contacts
              </button>
            </DataCard>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
              display: "grid",
              gap: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Quick actions</h2>
                <p style={{ margin: "0.35rem 0 0", color: "#64748b" }}>
                  Jump into the workflows you use most often to keep records fresh.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {[
                "Add contact",
                "Log activity",
                "Create deal",
                "Send email",
                "Record showing",
              ].map((action) => (
                <button
                  key={action}
                  type="button"
                  style={{
                    borderRadius: "999px",
                    border: "1px solid rgba(99, 102, 241, 0.35)",
                    background: "rgba(99, 102, 241, 0.08)",
                    color: "#3730a3",
                    padding: "0.6rem 1.1rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

interface DataCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

function DataCard({ title, description, children }: DataCardProps) {
  return (
    <article
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        borderRadius: "1.25rem",
        padding: "1.75rem",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ marginBottom: "1.1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h2>
        <p style={{ margin: "0.35rem 0 0", color: "#64748b" }}>{description}</p>
      </header>
      <div style={{ flex: 1 }}>{children}</div>
    </article>
  );
}

const secondaryButtonStyle: CSSProperties = {
  borderRadius: "0.85rem",
  border: "1px solid rgba(148, 163, 184, 0.6)",
  background: "rgba(248, 250, 252, 0.8)",
  padding: "0.55rem 1rem",
  fontWeight: 500,
  color: "#334155",
  cursor: "pointer",
  width: "fit-content",
};

import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { MetricCard } from "../components/MetricCard";
import type { DashboardSummary } from "@shared/types";

export function HomePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<DashboardSummary>("/api/summary")
      .then(setSummary)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load dashboard summary");
      });
  }, []);

  return (
    <section>
      <header>
        <h1>Team pulse</h1>
        <p style={{ maxWidth: "540px", color: "#4b5563" }}>
          A lightweight snapshot of pipeline health, deal momentum, and lead intake. Use these metrics to keep
          conversations grounded when you review weekly performance.
        </p>
      </header>
      {error ? <p style={{ color: "tomato" }}>{error}</p> : null}
      {!summary ? (
        <p>Loading insights…</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <MetricCard title="Open deals" value={summary.openDeals.toString()} subtitle="Actively being worked" />
          <MetricCard
            title="Won this month"
            value={summary.wonDealsThisMonth.toString()}
            subtitle="Closed-won across the team"
          />
          <MetricCard
            title="Pipeline value"
            value={`$${summary.totalPipelineValue.toLocaleString()}`}
            subtitle="Sum of all open opportunities"
          />
          <MetricCard
            title="New leads"
            value={summary.newLeadsThisMonth.toString()}
            subtitle="Captured in the past 30 days"
          />
        </div>
      )}
    </section>
  );
}

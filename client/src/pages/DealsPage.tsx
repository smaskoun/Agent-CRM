import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api";
import type { CRMDeal } from "@shared/types";

export function DealsPage() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<CRMDeal[]>("/api/deals")
      .then((result) => {
        setDeals(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load deals");
      });
  }, []);

  const totals = useMemo(() => {
    const openValue = deals.filter((deal) => deal.status === "open").reduce((sum, deal) => sum + deal.value, 0);
    const wonValue = deals.filter((deal) => deal.status === "won").reduce((sum, deal) => sum + deal.value, 0);
    return { openValue, wonValue };
  }, [deals]);

  return (
    <section>
      <header>
        <h1>Deals</h1>
        <p style={{ color: "#4b5563", maxWidth: "520px" }}>
          Review recent opportunities and keep an eye on revenue potential. This simplified demo showcases the data
          shape the server exposes.
        </p>
      </header>
      {error ? <p style={{ color: "tomato" }}>{error}</p> : null}
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <SummaryPill label="Open pipeline" value={totals.openValue} accent="#6366f1" />
        <SummaryPill label="Won" value={totals.wonValue} accent="#10b981" />
      </div>
      <section style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        {deals.map((deal) => (
          <article
            key={deal.id}
            style={{
              padding: "1.5rem",
              borderRadius: "1rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
              border: "1px solid rgba(15, 23, 42, 0.05)",
            }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ margin: 0 }}>{deal.title}</h3>
              <span style={{ fontWeight: 600 }}>${deal.value.toLocaleString()}</span>
            </header>
            <p style={{ margin: "0.5rem 0 0", color: "#6b7280" }}>Stage: {deal.stage}</p>
            <p style={{ margin: "0.5rem 0", color: "#6b7280" }}>Status: {deal.status}</p>
            <p style={{ margin: 0, color: "#9ca3af" }}>
              Updated {new Date(deal.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </article>
        ))}
      </section>
    </section>
  );
}

interface SummaryPillProps {
  label: string;
  value: number;
  accent: string;
}

function SummaryPill({ label, value, accent }: SummaryPillProps) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "999px",
        background: `linear-gradient(120deg, ${accent}, rgba(99, 102, 241, 0.45))`,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        minWidth: "180px",
      }}
    >
      <span style={{ opacity: 0.85 }}>{label}</span>
      <strong style={{ fontSize: "1.25rem" }}>${value.toLocaleString()}</strong>
    </div>
  );
}

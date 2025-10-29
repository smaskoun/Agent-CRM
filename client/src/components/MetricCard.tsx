import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <article
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "1.2rem",
        padding: "1.6rem",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
        <div>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.75rem",
              color: "#6366f1",
              fontWeight: 600,
            }}
          >
            {title}
          </p>
        </div>
        {icon ? (
          <span
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "rgba(99, 102, 241, 0.12)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.25rem",
            }}
          >
            {icon}
          </span>
        ) : null}
      </header>
      <p style={{ margin: 0, fontSize: "2rem", fontWeight: 600, color: "#0f172a" }}>{value}</p>
      {subtitle ? (
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>{subtitle}</p>
      ) : null}
    </article>
  );
}

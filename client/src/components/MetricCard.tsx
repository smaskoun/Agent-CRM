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
        backgroundColor: "#ffffff",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.05rem", opacity: 0.9 }}>{title}</h2>
          {subtitle ? (
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.9rem", color: "#6b7280" }}>{subtitle}</p>
          ) : null}
        </div>
        {icon ? <span style={{ fontSize: "1.5rem" }}>{icon}</span> : null}
      </header>
      <p style={{ margin: "1.25rem 0 0", fontSize: "2rem", fontWeight: 600 }}>{value}</p>
    </article>
  );
}

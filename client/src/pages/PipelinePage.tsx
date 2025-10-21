import { useEffect, useState } from "react";
import { apiGet } from "../api";
import type { PipelineStage } from "@shared/types";

export function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<PipelineStage[]>("/api/pipeline")
      .then((result) => {
        setStages(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load pipeline data");
      });
  }, []);

  return (
    <section>
      <header>
        <h1>Pipeline</h1>
        <p style={{ color: "#4b5563", maxWidth: "520px" }}>
          Visualise where opportunities currently live. Drag & drop is not wired up yet, but the layout mirrors a Kanban
          board so you can see how data feeds the UI.
        </p>
      </header>
      {error ? <p style={{ color: "tomato" }}>{error}</p> : null}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {stages.map((stage) => (
          <article
            key={stage.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              padding: "1.25rem",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 16px 35px rgba(15, 23, 42, 0.08)",
              border: "1px solid rgba(15, 23, 42, 0.05)",
            }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{stage.label}</h3>
              <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>{stage.deals.length} deals</span>
            </header>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {stage.deals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    padding: "0.75rem",
                    display: "grid",
                    gap: "0.35rem",
                  }}
                >
                  <strong>{deal.title}</strong>
                  <span style={{ color: "#6b7280" }}>${deal.value.toLocaleString()}</span>
                </div>
              ))}
              {stage.deals.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>No deals in this stage yet.</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import type { CreateClientResponse, CRMClient } from "@shared/types";

export function ClientsPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<CRMClient[]>("/api/clients")
      .then((result) => {
        setClients(result);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load clients");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();

    if (!name || !email) {
      setError("Name and email are required");
      return;
    }

    apiPost<CreateClientResponse>("/api/clients", { name, email, phone })
      .then((response) => {
        setClients((previous) => [response.client, ...previous]);
        event.currentTarget.reset();
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to create client");
      });
  };

  return (
    <section>
      <header>
        <h1>Clients</h1>
        <p style={{ color: "#4b5563", maxWidth: "520px" }}>
          Capture new relationships and track where every conversation sits. This demo stores entries in memory so you
          can explore flows without needing a database connection.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          borderRadius: "1rem",
          backgroundColor: "#ffffff",
          display: "grid",
          gap: "0.75rem",
          maxWidth: "520px",
        }}
      >
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Avery Smith" required style={inputStyle} />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="avery@example.com" required style={inputStyle} />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" placeholder="(555) 010-0099" style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>
          Add client
        </button>
        {error ? <p style={{ color: "tomato" }}>{error}</p> : null}
      </form>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Recently added</h2>
        {loading ? <p>Loading clients…</p> : null}
        {!loading && clients.length === 0 ? <p>No clients yet. Add your first relationship above.</p> : null}
        <div style={{ display: "grid", gap: "1rem" }}>
          {clients.map((client) => (
            <article
              key={client.id}
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "1rem",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(15, 23, 42, 0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{client.name}</h3>
              <p style={{ margin: "0.25rem 0" }}>{client.email}</p>
              {client.phone ? <p style={{ margin: "0.25rem 0" }}>{client.phone}</p> : null}
              <p style={{ margin: "0.25rem 0", color: "#6b7280" }}>Stage: {client.stage}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  borderRadius: "0.75rem",
  border: "1px solid rgba(15, 23, 42, 0.12)",
  padding: "0.65rem 0.85rem",
  fontSize: "1rem",
};

const buttonStyle: React.CSSProperties = {
  borderRadius: "0.75rem",
  border: "none",
  padding: "0.75rem 1.1rem",
  fontWeight: 600,
  background: "linear-gradient(120deg, #4338ca, #6366f1)",
  color: "#fff",
  cursor: "pointer",
};

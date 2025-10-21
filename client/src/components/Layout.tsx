import type { ReactNode } from "react";
import "../index.css";

interface LayoutProps {
  navigation: ReactNode[];
  children: ReactNode;
}

export function Layout({ navigation, children }: LayoutProps) {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <aside
        style={{
          width: "220px",
          padding: "2rem 1.5rem",
          borderRight: "1px solid rgba(15, 23, 42, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Agent CRM</h1>
        <nav style={{ display: "grid", gap: "0.75rem" }}>
          {navigation.map((link, index) => (
            <span
              key={index}
              style={{
                fontWeight: 500,
                color: "#1f2937",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.75rem",
                transition: "background-color 0.2s ease",
              }}
            >
              {link}
            </span>
          ))}
        </nav>
      </aside>
      <main
        style={{
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}

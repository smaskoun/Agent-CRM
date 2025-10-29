import type { CSSProperties, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import "../index.css";

interface NavigationItem {
  href: string;
  label: string;
  icon?: string;
}

interface LayoutProps {
  navigation: NavigationItem[];
  children: ReactNode;
}

const sidebarLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.65rem 0.85rem",
  borderRadius: "0.85rem",
  fontWeight: 500,
  color: "#1f2937",
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
};

export function Layout({ navigation, children }: LayoutProps) {
  const [location, setLocation] = useLocation();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f8fafc 0%, #eef2ff 60%, #e0e7ff 100%)",
      }}
    >
      <aside
        style={{
          width: "260px",
          padding: "2.25rem 2rem",
          borderRight: "1px solid rgba(15, 23, 42, 0.06)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <span
            aria-hidden
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            AP
          </span>
          <div>
            <strong style={{ fontSize: "1.05rem", display: "block" }}>AgentPro CRM</strong>
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Brokerage Edition</span>
          </div>
        </div>

        <nav style={{ display: "grid", gap: "0.35rem" }}>
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  style={{
                    ...sidebarLinkStyle,
                    backgroundColor: isActive ? "rgba(79, 70, 229, 0.12)" : "transparent",
                    boxShadow: isActive ? "0 10px 25px rgba(79, 70, 229, 0.2)" : "none",
                    color: isActive ? "#312e81" : sidebarLinkStyle.color,
                  }}
                >
                  {item.icon ? (
                    <span aria-hidden style={{ fontSize: "1.1rem" }}>
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "1.25rem",
            borderRadius: "1rem",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(59, 130, 246, 0.2))",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            color: "#1f2937",
          }}
        >
          <h2 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>Keep momentum</h2>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563" }}>
            Add your latest leads and keep follow-ups centralised.
          </p>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.75rem 2.5rem 1.25rem",
            borderBottom: "1px solid rgba(15, 23, 42, 0.07)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderRadius: "999px",
              padding: "0.35rem 0.85rem",
              gap: "0.65rem",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              minWidth: "260px",
            }}
          >
            <span aria-hidden style={{ color: "#6b7280", fontSize: "1rem" }}>
              🔍
            </span>
            <input
              placeholder="Search contacts, deals, or notes"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                flex: 1,
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => setLocation("/clients")}
              style={{
                borderRadius: "999px",
                border: "none",
                padding: "0.65rem 1.35rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(79, 70, 229, 0.25)",
              }}
            >
              + Add record
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                aria-hidden
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 600,
                }}
              >
                AW
              </span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Avery Watkins</strong>
                <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>Team Lead</span>
              </div>
            </div>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            padding: "2.5rem",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

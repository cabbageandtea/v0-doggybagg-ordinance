"use client"

import React from "react"

export default function BuiltWithBadge() {
  const [visible, setVisible] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("v0-built-with-hidden") !== "1"
    } catch (e) {
      return true
    }
  })

  React.useEffect(() => {
    try {
      if (!visible) localStorage.setItem("v0-built-with-hidden", "1")
    } catch (e) {
      // noop
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      id="v0-built-with-button"
      style={{
        border: "1px solid hsl(0deg 0% 100% / 12%)",
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "#121212",
        color: "white",
        padding: "8px 12px",
        borderRadius: 8,
        fontWeight: 400,
        fontSize: 14,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        letterSpacing: "0.02em",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <a
        href="https://v0.app/chat/api/open/built-with-v0/b_rPFlAQDYPcP?ref=9C5QHG"
        target="_blank"
        rel="noopener"
        style={{
          color: "inherit",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        Built with
        <svg
          fill="currentColor"
          viewBox="0 0 147 70"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 20, height: 20 }}
          aria-hidden
        >
          <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
          <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
        </svg>
      </a>

      <button
        onClick={() => setVisible(false)}
        onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.opacity = "0.7")}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: 2,
          marginLeft: 4,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          opacity: 0.7,
          transition: "opacity 0.2s",
          transform: "translateZ(0)",
        }}
        aria-label="Close"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap" }}>
        v0
      </span>
    </div>
  )
}

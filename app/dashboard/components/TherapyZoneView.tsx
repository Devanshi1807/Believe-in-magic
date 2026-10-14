// app/dashboard/components/TherapyZoneView.tsx
"use client";

import React, { useState } from "react";

interface TherapyZoneViewProps {
  onLaunchGame: (gameName: string, eye: string, theme?: "yellow" | "red" | "cyan" | "dual") => void;
}

export default function TherapyZoneView({ onLaunchGame }: TherapyZoneViewProps) {
  const [activeTab, setActiveTab] = useState<"Monocular" | "MFBF">("Monocular");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid #1a253e", paddingBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("Monocular")}
          style={{
            background: activeTab === "Monocular" ? "#1e2944" : "transparent",
            color: activeTab === "Monocular" ? "#38bdf8" : "#94a3b8",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.2rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          👁️ Monocular (Patching)
        </button>
        <button
          onClick={() => setActiveTab("MFBF")}
          style={{
            background: activeTab === "MFBF" ? "#1e2944" : "transparent",
            color: activeTab === "MFBF" ? "#a855f7" : "#94a3b8",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.2rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          👓 MFBF & Dichoptics (Red-Cyan)
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {activeTab === "Monocular" ? (
          <>
            <div
              onClick={() => onLaunchGame("Smiley", "Monocular Left", "yellow")}
              style={{ background: "#0d1322", border: "1.5px solid #1f2d4d", borderRadius: 16, padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>😊</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Smiley Crowding Matrix</h3>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                Anti-crowding foveal training. Patch strong eye and find the smiling targets.
              </p>
              <span style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>
                Prescribed by Doctor ★
              </span>
            </div>

            <div
              onClick={() => onLaunchGame("Catch the Fruits", "Monocular Left", "yellow")}
              style={{ background: "#0d1322", border: "1.5px solid #1f2d4d", borderRadius: 16, padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🧺</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Catch the Fruits</h3>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                Smooth pursuit vertical tracking and visual-motor speed coordination.
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => onLaunchGame("Smiley", "MFBF Right", "red")}
              style={{ background: "#0d1322", border: "1.5px solid rgba(239, 68, 68, 0.4)", borderRadius: 16, padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔴</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Smiley Red Glass</h3>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                MFBF Right channel. Pure red chromatic contours isolating right eye fovea.
              </p>
            </div>

            <div
              onClick={() => onLaunchGame("Smiley", "MFBF Left", "cyan")}
              style={{ background: "#0d1322", border: "1.5px solid rgba(56, 189, 248, 0.4)", borderRadius: 16, padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔵</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Smiley Blue Glass</h3>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                MFBF Left channel. Pure blue contours isolating left eye fovea.
              </p>
            </div>

            <div
              onClick={() => onLaunchGame("Smiley Dual-Tone", "MFBF Left", "dual")}
              style={{ background: "linear-gradient(145deg, #0e1229 0%, #170d24 100%)", border: "1.5px solid rgba(168, 85, 247, 0.6)", borderRadius: 16, padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔴🔵</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#c084fc" }}>Smiley Dual-Tone Fusion</h3>
              <p style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "0.4rem" }}>
                Full binocular summation. Both eyes must remain open to see all targets.
              </p>
              <span style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.75rem", color: "#c084fc", fontWeight: 700 }}>
                Anti-Suppression Prescribed ★
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
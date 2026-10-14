// app/dashboard/components/ProgressTrackerView.tsx
"use client";

import React from "react";

export default function ProgressTrackerView() {
  return (
    <div style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Visual Acuity & Recovery Tracker</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Longitudinal recovery metrics analyzed across active sessions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Total Minutes Trained</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.3rem" }}>45 Min</div>
        </div>
        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Sessions Completed</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2dd4bf", marginTop: "0.3rem" }}>3 Sessions</div>
        </div>
        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Average Accuracy</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.3rem" }}>88%</div>
        </div>
      </div>

      <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 16, padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Current Clinical Tier</h3>
        <p style={{ color: "#2dd4bf", fontSize: "1.1rem", fontWeight: 800 }}>Level 3: Intermediate Crowding Breaker</p>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Next Milestone: Complete 5 more sessions at Fine/Micro target density to advance to Level 4 (Advanced Anti-Suppression).
        </p>
      </div>
    </div>
  );
}
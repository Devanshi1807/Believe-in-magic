// app/dashboard/components/AssignedTherapiesView.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AssignedTherapyItem, generatePrescriptionFromReport } from "@/app/therapy/data/therapyRules";

interface AssignedTherapiesViewProps {
  onEnterGame: (
    gameName: string,
    modality: string,
    colorTheme?: "yellow" | "red" | "cyan" | "dual"
  ) => void;
}

export default function AssignedTherapiesView({ onEnterGame }: AssignedTherapiesViewProps) {
  const [assignedList, setAssignedList] = useState<AssignedTherapyItem[]>([]);
  const [hasReport, setHasReport] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("bim_assigned_therapies");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAssignedList(parsed);
          setHasReport(true);
          return;
        }
      } catch (e) {
        console.error("Failed to parse assigned therapies", e);
      }
    }

    // Fallback default baseline if no report is uploaded yet
    const defaultBaseline = generatePrescriptionFromReport({
      targetEye: "left",
      suppressionDetected: true,
    });
    setAssignedList(defaultBaseline);
    setHasReport(false);
  }, []);

  return (
    <div style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Therapies Assigned by Dr. Iris</h2>
          <span
            style={{
              background: hasReport ? "rgba(45, 212, 191, 0.15)" : "rgba(245, 158, 11, 0.15)",
              color: hasReport ? "#2dd4bf" : "#f59e0b",
              border: `1px solid ${hasReport ? "#2dd4bf" : "#f59e0b"}`,
              fontSize: "0.74rem",
              fontWeight: 700,
              padding: "0.2rem 0.65rem",
              borderRadius: 9999,
            }}
          >
            {hasReport ? "✓ Tailored from Uploaded Report" : "● Default Baseline (Upload Report to Calibrate)"}
          </span>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.35rem" }}>
          Targeted exercises dynamically selected by the AI based on your eye condition, suppression status, and visual acuity.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {assignedList.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#0d1322",
              border: "1px solid #1a253d",
              borderRadius: 16,
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>{item.title}</span>
                <span
                  style={{
                    background: "rgba(56, 189, 248, 0.12)",
                    color: item.color,
                    border: `1px solid ${item.color}`,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: 6,
                  }}
                >
                  {item.badge}
                </span>
              </div>
              <div style={{ color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.4 }}>{item.reason}</div>
              <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "0.5rem" }}>
                Modality: <strong style={{ color: "#94a3b8" }}>{item.gameModality}</strong> • Prescribed Duration:{" "}
                <strong style={{ color: "#94a3b8" }}>{item.duration}</strong>
              </div>
            </div>

            {/* Direct click handler with safe fallback */}
            <button
              onClick={() =>
                onEnterGame(
                  item.gameName,
                  item.gameModality,
                  (item as any).colorTheme || (item.gameName.includes("Dual") ? "dual" : "yellow")
                )
              }
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0.85rem 1.5rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              Start Session →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
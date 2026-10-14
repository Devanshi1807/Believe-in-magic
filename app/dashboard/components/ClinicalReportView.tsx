// app/dashboard/components/ClinicalReportView.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClinicalReportView() {
  const router = useRouter();
  const [reportPlan, setReportPlan] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bim_therapy_plan");
    if (saved) {
      try {
        setReportPlan(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div style={{ maxWidth: 880, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Clinical Prescription & OCR</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Verified optometric parameters analyzed by Gemini Vision.</p>
        </div>
        <button
          onClick={() => router.push("/upload-report")}
          style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "0.65rem 1.25rem", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
        >
          Upload New Report 📄
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Target Weak Eye</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.4rem" }}>
            {reportPlan?.targetEye ? (reportPlan.targetEye === "left" ? "Left Eye (OS)" : "Right Eye (OD)") : "Left Eye (OS)"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>Selected for Monocular Occlusion</div>
        </div>

        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Prescribed Session</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2dd4bf", marginTop: "0.4rem" }}>
            {reportPlan?.totalSessionMinutes || 20} Minutes / Day
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>Structured across 2 intervals</div>
        </div>

        <div style={{ background: "#0d1322", border: "1px solid #1a243c", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Suppression Status</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.4rem" }}>
            Active (MFBF Advised)
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.3rem" }}>Requires Red-Cyan Dichoptic Games</div>
        </div>
      </div>
    </div>
  );
}
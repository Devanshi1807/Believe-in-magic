// src/app/upload-report/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./upload.module.css";
import { useVoiceAssistant } from "../context/VoiceAssistantContext";
import { generatePrescriptionFromReport } from "../therapy/data/therapyRules";

interface GamePrescription {
  gameId: string;
  name: string;
  durationMinutes: number;
  goal: string;
}

interface AnalysisResult {
  patientName: string;
  amblyopicEye: string;
  visualAcuity: {
    rightEyeOD: string;
    leftEyeOS: string;
  };
  suppressionDetected: boolean;
  explanation: string;
  therapyPlan: {
    targetEye: string;
    totalSessionMinutes: number;
    startingContrastWeakEye: number;
    startingContrastStrongEye: number;
    games: GamePrescription[];
  };
}

export default function UploadReportPage() {
  const { speak } = useVoiceAssistant();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    speak(
      "Welcome to Believe in Magic! Please upload your clinical eye report or prescription. Our AI will analyze your visual acuity and configure your therapy plan."
    );
  }, [speak]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze-report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      setResult(data.data);

      // 1. Build clinical rules payload
      const clinicalPayload = {
        targetEye: (data.data.amblyopicEye === "right" ? "right" : "left") as "left" | "right",
        rightEyeOD: data.data.visualAcuity?.rightEyeOD || "20/20",
        leftEyeOS: data.data.visualAcuity?.leftEyeOS || "20/60",
        suppressionDetected: Boolean(data.data.suppressionDetected),
      };

      // 2. Generate customized therapies list based on findings
      const dynamicTherapies = generatePrescriptionFromReport(clinicalPayload);

      // 3. Persist to localStorage
      localStorage.setItem("bim_assigned_therapies", JSON.stringify(dynamicTherapies));
      localStorage.setItem("bim_therapy_plan", JSON.stringify(data.data.therapyPlan));
      localStorage.setItem("bim_clinical_report", JSON.stringify(data.data));

      if (data.data.patientName && data.data.patientName !== "Not specified") {
        localStorage.setItem("bim_patient_name", data.data.patientName);
      }

      speak(
        `Analysis complete! We calibrated your target eye as ${
          data.data.amblyopicEye === "left" ? "Left Eye (OS)" : "Right Eye (OD)"
        }. Your customized therapies have been assigned to your dashboard.`
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong while analyzing the report.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Return Button to Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "#161f36",
            color: "#38bdf8",
            border: "1px solid #28376d",
            borderRadius: "8px",
            padding: "0.5rem 1.1rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1f2b4c")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#161f36")}
        >
          ← Back to Dashboard
        </button>

        <div className={styles.header}>
          <span className={styles.badge}>Vision Diagnostic</span>
          <h1 className={styles.title}>Upload Examination Report</h1>
          <p className={styles.subtitle}>
            Upload a clear photo of your prescription. Our vision AI will extract your visual acuity numbers and generate your personalized game routine.
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {!result ? (
          <div>
            <label className={styles.dropzone}>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {preview ? (
                <img src={preview} alt="Prescription preview" className={styles.previewImage} />
              ) : (
                <div className={styles.uploadPrompt}>
                  <span className={styles.uploadIcon}>📄</span>
                  <span className={styles.promptPrimary}>Click or tap to upload report</span>
                  <span className={styles.promptSecondary}>Supports JPG, PNG, and WebP</span>
                </div>
              )}
            </label>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={styles.actionBtn}
            >
              {loading ? "Reading & Analyzing Report..." : "Analyze Report with AI"}
            </button>
          </div>
        ) : (
          <div className={styles.resultsSection}>
            {/* Friendly AI Explanation */}
            <div className={styles.explanationCard}>
              <h2 className={styles.explanationTitle}>Report Breakdown</h2>
              <p className={styles.explanationText}>{result.explanation}</p>
            </div>

            {/* Extracted Acuities */}
            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Right Eye (OD)</div>
                <div className={styles.metricValue}>{result.visualAcuity.rightEyeOD}</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Left Eye (OS)</div>
                <div className={styles.metricValue}>{result.visualAcuity.leftEyeOS}</div>
              </div>
            </div>

            {/* Therapy Routine */}
            <div>
              <div className={styles.planHeader}>
                <h3 className={styles.planTitle}>Today's Prescribed Plan</h3>
                <span className={styles.planDuration}>
                  {result.therapyPlan.totalSessionMinutes} mins total
                </span>
              </div>

              <div className={styles.gameList}>
                {result.therapyPlan.games.map((game, idx) => (
                  <div key={idx} className={styles.gameItem}>
                    <div>
                      <div className={styles.gameName}>{game.name}</div>
                      <div className={styles.gameGoal}>{game.goal}</div>
                    </div>
                    <span className={styles.gameMins}>{game.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                onClick={handleGoToDashboard}
                className={styles.startTherapyBtn}
                style={{ flex: 1 }}
              >
                Go to Dashboard & Assigned Therapies →
              </button>
              <button
                onClick={() => router.push("/therapy")}
                style={{
                  background: "#161f36",
                  color: "#38bdf8",
                  border: "1px solid #28376d",
                  borderRadius: "12px",
                  padding: "1rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Therapy Zone 🎮
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
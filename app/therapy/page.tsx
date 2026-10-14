// app/therapy/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./therapy.module.css";
import Sidebar from "./components/Sidebar";
import WelcomeGate from "./components/WelcomeGate";
import MonocularView from "./components/MonocularView";
import MFBFView from "./components/MFBFView";
import MonocularGameStage from "./components/MonocularGameStage";
import SmileyGame from "./components/games/SmileyGame";
import CatchFruitsGame from "./components/games/CatchFruitsGame";

export default function TherapyPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Monocular");

  // Game session launcher state supporting single and dual-tone themes
  const [activeSession, setActiveSession] = useState<{
    gameName: string;
    eye: string;
    duration: number;
    colorTheme?: "yellow" | "red" | "cyan" | "dual";
  } | null>(null);

  // Auto-authenticate if patient already logged in via Dashboard or Sign-in
  useEffect(() => {
    const savedName = localStorage.getItem("bim_patient_name");
    if (savedName) {
      setPatientName(savedName);
      setHasStarted(true); // Automatically bypass the welcome gate
    }
  }, []);

  const handleProceed = (name: string) => {
    setPatientName(name);
    localStorage.setItem("bim_patient_name", name);
    setHasStarted(true);
  };

  return (
    <div className={styles.layout}>
      {/* 1. Primary Left Sidebar */}
      <Sidebar
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
      />

      {/* 2. Main Portal Workspace */}
      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          {/* Back to Dashboard Navigation */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "#161f36",
              color: "#38bdf8",
              border: "1px solid #28376d",
              borderRadius: "8px",
              padding: "0.45rem 1rem",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              marginRight: "auto",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1f2b4c")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#161f36")}
          >
            ← Back to Dashboard
          </button>

          <div className={styles.iconGroup}>
            <span>📋</span>
            <span>🎮</span>
            <span>⚙️</span>
          </div>
        </header>

        {!hasStarted ? (
          <WelcomeGate initialName={patientName} onProceed={handleProceed} />
        ) : selectedSection === "Monocular" ? (
          <MonocularView
            onSelectGame={(gameName, eye, duration) =>
              setActiveSession({ gameName, eye, duration, colorTheme: "yellow" })
            }
          />
        ) : selectedSection === "MFBF" ? (
          <MFBFView
            onSelectGame={(gameName, subSection, duration, customTheme) => {
              // Supports customTheme (e.g. "dual") or falls back to eye channel
              const theme =
                customTheme || (subSection === "MFBF Right" ? "red" : "cyan");
              setActiveSession({
                gameName,
                eye: subSection,
                duration,
                colorTheme: theme,
              });
            }}
          />
        ) : (
          <div className={styles.placeholderSection}>
            {selectedSection} section is under calibration.
          </div>
        )}
      </div>

      {/* 3. Game Launch Routing */}
      {activeSession && (
        <>
          {activeSession.gameName.startsWith("Smiley") ? (
            <SmileyGame
              activeEye={activeSession.eye}
              durationMinutes={activeSession.duration}
              colorTheme={activeSession.colorTheme}
              onClose={() => setActiveSession(null)}
            />
          ) : activeSession.gameName === "Catch the Fruits" ? (
            <CatchFruitsGame
              activeEye={activeSession.eye}
              durationMinutes={activeSession.duration}
              colorTheme={activeSession.colorTheme as any}
              onClose={() => setActiveSession(null)}
            />
          ) : (
            <MonocularGameStage
              gameTitle={activeSession.gameName}
              activeEye={activeSession.eye}
              durationMinutes={activeSession.duration}
              onClose={() => setActiveSession(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
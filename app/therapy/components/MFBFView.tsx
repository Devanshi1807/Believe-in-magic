// app/therapy/components/MFBFView.tsx
"use client";

import React, { useState } from "react";
import styles from "./MonocularView.module.css";

// app/therapy/components/MFBFView.tsx

interface MFBFViewProps {
  onSelectGame: (
    gameName: string,
    subSection: "MFBF Left" | "MFBF Right",
    duration: number,
    customTheme?: "red" | "cyan" | "dual" // <-- Add this 4th parameter
  ) => void;
}

export default function MFBFView({ onSelectGame }: MFBFViewProps) {
  const [selectedSubTab, setSelectedSubTab] = useState<"MFBF Left" | "MFBF Right">("MFBF Right");
  const [duration, setDuration] = useState(3);
  const [acuity, setAcuity] = useState("20/60");
  const [difficulty, setDifficulty] = useState("Easy");
  const [backgroundType, setBackgroundType] = useState("Dark Field");

  const isRedMode = selectedSubTab === "MFBF Right";

  return (
    <div className={styles.container}>
      <aside className={styles.subSidebar}>
        <div className={styles.subSidebarHeader}>MFBF Mode</div>
        <nav className={styles.subSidebarNav}>
          <button
            onClick={() => setSelectedSubTab("MFBF Left")}
            className={`${styles.subNavItem} ${
              selectedSubTab === "MFBF Left" ? styles.subNavItemActive : ""
            }`}
          >
            <span>MFBF Left (Blue)</span>
            <span style={{ color: "#0026ff" }}>👓</span>
          </button>
          <button
            onClick={() => setSelectedSubTab("MFBF Right")}
            className={`${styles.subNavItem} ${
              selectedSubTab === "MFBF Right" ? styles.subNavItemActive : ""
            }`}
          >
            <span>MFBF Right (Red)</span>
            <span style={{ color: "#ff0000" }}>👓</span>
          </button>
        </nav>
      </aside>

      <div className={styles.contentArea}>
        <header className={styles.controlBar}>
          <div className={styles.breadcrumbTitle}>
            <span>›</span> {selectedSubTab}{" "}
            <span style={{ fontSize: "0.85rem", color: isRedMode ? "#ef4444" : "#3b82f6", marginLeft: "0.5rem" }}>
              ({isRedMode ? "Red Glass Active" : "Blue Glass Active"})
            </span>
          </div>

          <div className={styles.controlsCluster}>
            <div className={styles.controlItem}>
              <span>Duration</span>
              <input
                type="range"
                min="1"
                max="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <span className={styles.pillBadge}>{duration} min</span>
            </div>

            <div className={styles.controlItem}>
              <span>Acuity</span>
              <input
                type="text"
                value={acuity}
                onChange={(e) => setAcuity(e.target.value)}
                style={{ width: "70px", textAlign: "center" }}
                className={styles.selectInput}
              />
            </div>

            <div className={styles.controlItem}>
              <span>Difficulty</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={styles.selectInput}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className={styles.controlItem}>
              <span>Background</span>
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value)}
                className={styles.selectInput}
              >
                <option value="Dark Field">Dark Field</option>
                <option value="True Black">True Black</option>
              </select>
            </div>
          </div>
        </header>

        <div className={styles.workspace}>
          {/* Pursuits Category */}
          <div className={styles.categoryRow}>
            <div className={styles.categoryTag} style={{ color: isRedMode ? "#ef4444" : "#0026ff" }}>
              Pursuits
            </div>
            <div className={styles.grid}>
              <div
                onClick={() => onSelectGame("Catch the Fruits", selectedSubTab, duration)}
                className={styles.tile}
                style={{
                  borderColor: isRedMode ? "rgba(239, 68, 68, 0.4)" : "rgba(0, 38, 255, 0.4)",
                }}
              >
                <span className={styles.tileIcon}>🍎</span>
                <span className={styles.tileName}>Catch the Fruits</span>
              </div>
            </div>
          </div>

          {/* Crowding Category */}
          <div className={styles.categoryRow}>
            <div className={styles.categoryTag} style={{ color: isRedMode ? "#ef4444" : "#0026ff" }}>
              Crowding
            </div>
            <div className={styles.grid}>
              <div
                onClick={() => onSelectGame("Smiley", selectedSubTab, duration)}
                className={styles.tile}
                style={{
                  borderColor: isRedMode ? "rgba(239, 68, 68, 0.4)" : "rgba(0, 38, 255, 0.4)",
                }}
              >
                <span className={styles.tileIcon}>😊</span>
                <span className={styles.tileName}>Smiley</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
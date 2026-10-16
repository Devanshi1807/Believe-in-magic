// app/therapy/components/MonocularView.tsx
"use client";

import React, { useState } from "react";
import styles from "./MonocularView.module.css";

interface MonocularViewProps {
  onSelectGame: (gameName: string, eye: string, duration: number) => void;
}

interface ExerciseItem {
  id: string;
  name: string;
  icon: string;
}

interface ExerciseCategory {
  category: string;
  items: ExerciseItem[];
}

const EXERCISE_DATA: ExerciseCategory[] = [
  {
    category: "Crowding & Macular Resolution",
    items: [
      { id: "smiley", name: "Smiley Anti-Crowding", icon: "😊" },
      { id: "slant", name: "Match the Slant Lines", icon: "📐" },
      { id: "pattern", name: "Pattern Matching", icon: "🧩" },
    ],
  },
  {
    category: "Pursuits & Smooth Tracking",
    items: [
      { id: "balloon_pursuit", name: "Balloon Pop Pursuit", icon: "🎈" },
      { id: "catch_fruits", name: "Catch the Fruits", icon: "🍎" },
      { id: "floating_letters", name: "Floating Letters Tachistoscope", icon: "📄" },
      { id: "symbol_contrast", name: "Match the Symbol Contrast", icon: "🎯" },
    ],
  },
  {
    category: "Saccades & Rapid Foveation",
    items: [
      { id: "balloon_saccades", name: "Balloon Pop Saccades", icon: "💥" },
      { id: "number_text", name: "Number Text Grid", icon: "🔢" },
      { id: "jump_letters", name: "Jump Letters Tachistoscope", icon: "🔤" },
    ],
  },
  {
    category: "Others & Perception",
    items: [
      { id: "asteroids", name: "Shoot The Asteroids", icon: "🚀" },
      { id: "crush_letters", name: "Crush the Letters", icon: "🔡" },
      { id: "connect_letters", name: "Connect the Letters", icon: "📈" },
      { id: "hop_e", name: "Hop the E", icon: "🔲" },
    ],
  },
];

export default function MonocularView({ onSelectGame }: MonocularViewProps) {
  const [selectedEye, setSelectedEye] = useState<"Monocular Left" | "Monocular Right">("Monocular Left");
  const [duration, setDuration] = useState(3);
  const [acuity, setAcuity] = useState("20/60");
  const [difficulty, setDifficulty] = useState("Easy");
  const [backgroundType, setBackgroundType] = useState("Dark Field");

  return (
    <div className={styles.container}>
      {/* Top Clinical Header & Unified Parameters */}
      <header className={styles.controlBar}>
        <div className={styles.leftControls}>
          {/* Eye Target Switcher */}
          <div className={styles.eyeSwitcher}>
            <button
              onClick={() => setSelectedEye("Monocular Left")}
              className={`${styles.eyeBtn} ${selectedEye === "Monocular Left" ? styles.eyeBtnActive : ""}`}
            >
              <span className={styles.eyeIcon}>👁️</span>
              <span>Left Eye (OS)</span>
            </button>
            <button
              onClick={() => setSelectedEye("Monocular Right")}
              className={`${styles.eyeBtn} ${selectedEye === "Monocular Right" ? styles.eyeBtnActive : ""}`}
            >
              <span className={styles.eyeIcon}>👁️</span>
              <span>Right Eye (OD)</span>
            </button>
          </div>
        </div>

        {/* Clinical Parameters */}
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
            <span>Baseline Acuity</span>
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
            <span>Field</span>
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

      {/* Main Exercises Workspace */}
      <main className={styles.workspace}>
        {EXERCISE_DATA.map((group) => (
          <section key={group.category} className={styles.sectionGroup}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.categoryTitle}>{group.category}</h2>
              <div className={styles.sectionDivider} />
            </div>

            <div className={styles.grid}>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectGame(item.name, selectedEye, duration)}
                  className={styles.tile}
                >
                  <div className={styles.iconWrapper}>{item.icon}</div>
                  <div className={styles.tileName}>{item.name}</div>
                  <div className={styles.playAction}>Start Protocol →</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import styles from "./MonocularView.module.css";
import { MONOCULAR_CATEGORIES } from "../data/monocularExercises";

interface MonocularViewProps {
  onSelectGame: (gameName: string, eye: string, duration: number) => void;
}

export default function MonocularView({ onSelectGame }: MonocularViewProps) {
  const [selectedEye, setSelectedEye] = useState<"Monocular Left" | "Monocular Right">("Monocular Left");
  const [duration, setDuration] = useState(3);
  const [acuity, setAcuity] = useState("20/60");
  const [difficulty, setDifficulty] = useState("Easy");
  const [backgroundType, setBackgroundType] = useState("Dark Grid");

  return (
    <div className={styles.container}>
      {/* Monocular Left / Right Sub Navigation */}
      <aside className={styles.subSidebar}>
        <div className={styles.subSidebarHeader}>Monocular</div>
        <nav className={styles.subSidebarNav}>
          <button
            onClick={() => setSelectedEye("Monocular Left")}
            className={`${styles.subNavItem} ${
              selectedEye === "Monocular Left" ? styles.subNavItemActive : ""
            }`}
          >
            <span>Monocular Left</span>
            <span>👁️</span>
          </button>
          <button
            onClick={() => setSelectedEye("Monocular Right")}
            className={`${styles.subNavItem} ${
              selectedEye === "Monocular Right" ? styles.subNavItemActive : ""
            }`}
          >
            <span>Monocular Right</span>
            <span>👁️</span>
          </button>
        </nav>
      </aside>

      {/* Main Game Catalog with Controls */}
      <div className={styles.contentArea}>
        <header className={styles.controlBar}>
          <div className={styles.breadcrumbTitle}>› {selectedEye}</div>

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
                style={{ width: "65px", textAlign: "center" }}
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
                <option value="Dark Grid">Dark Grid</option>
                <option value="High Contrast">High Contrast</option>
                <option value="Neutral Grey">Neutral Grey</option>
              </select>
            </div>
          </div>
        </header>

        <div className={styles.workspace}>
          {MONOCULAR_CATEGORIES.map((category) => (
            <div key={category.category} className={styles.categoryRow}>
              <div className={styles.categoryTag}>{category.category}</div>
              <div className={styles.grid}>
                {category.games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => onSelectGame(game.name, selectedEye, duration)}
                    className={styles.tile}
                  >
                    <span className={styles.tileIcon}>{game.icon}</span>
                    <span className={styles.tileName}>{game.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// app/therapy/components/games/SmileyGame.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SmileyGame.module.css";
import { useVoiceAssistant } from "@/app/context/VoiceAssistantContext";

interface SmileyGameProps {
  activeEye: string;
  durationMinutes: number;
  colorTheme?: "yellow" | "red" | "cyan" | "dual"; // <-- Ensure "dual" is listed
  onClose: () => void;
}

type FaceType = "happy" | "sad";

interface GridFace {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  radius: number;
  type: FaceType;
  popped: boolean;
  isWrongShake?: boolean;
}

const SIZE_PRESETS: Record<number, { label: string; rows: number; cols: number }> = {
  1: { label: "Large", rows: 8, cols: 16 },
  2: { label: "Medium", rows: 10, cols: 20 },
  3: { label: "Small", rows: 12, cols: 24 },
  4: { label: "Fine", rows: 15, cols: 30 },
  5: { label: "Micro", rows: 18, cols: 36 },
};

export default function SmileyGame({
  activeEye,
  durationMinutes,
  colorTheme = "yellow",
  onClose,
}: SmileyGameProps) {
  const { speak, stop } = useVoiceAssistant();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sizeLevel, setSizeLevel] = useState<number>(2);
  const [intensity, setIntensity] = useState<number>(100);

  const [score, setScore] = useState(0);
  const [targetsFound, setTargetsFound] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [totalTargetsRemaining, setTotalTargetsRemaining] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [evaluationText, setEvaluationText] = useState<string | null>(null);

  const gridRef = useRef<GridFace[]>([]);
  const isInitializedRef = useRef(false);
  const patchedEye = activeEye === "Monocular Left" ? "RIGHT" : "LEFT";

  // 1. Initial Voice Instructions on Game Start
  useEffect(() => {
    let instruction = "";
    if (colorTheme === "red") {
      instruction = `Welcome to the Red Glasses MFBF exercise. Put on your Red-Cyan 3D glasses with the red filter over your right eye. Carefully scan the grid and click only the Happy Smileys. Sad smileys are crowding flankers. Begin when ready!`;
    } else if (colorTheme === "cyan") {
      instruction = `Welcome to the Blue Glasses MFBF exercise. Put on your Red-Cyan glasses with the blue filter over your left eye. Scan each column and tap every Happy Smiley to pop it.`;
    } else {
      instruction = `Welcome to the Monocular Crowding exercise. Please patch your ${patchedEye} eye completely. Using only your training eye, spot and click the happy smileys to break crowding.`;
    }

    speak(instruction);

    return () => stop();
  }, [colorTheme, patchedEye, speak, stop]);

  // 2. Automated Evaluation Calculation
  const finishSession = useCallback(() => {
    setSessionCompleted(true);

    const accuracy =
      targetsFound + wrongClicks > 0
        ? Math.round((targetsFound / (targetsFound + wrongClicks)) * 100)
        : 100;

    let tier = "Level 1: Novice Fixation";
    let practiceAdvice = "30 minutes daily across 2 sessions.";

    if (score >= 250 && sizeLevel >= 4) {
      tier = "Level 5: Master Macular Resolution";
      practiceAdvice = "15 minutes maintenance daily.";
    } else if (score >= 180 && sizeLevel >= 3) {
      tier = "Level 4: Advanced Anti-Suppression";
      practiceAdvice = "20 minutes daily.";
    } else if (score >= 100) {
      tier = "Level 3: Intermediate Crowding Breaker";
      practiceAdvice = "25 minutes daily.";
    } else if (score >= 40) {
      tier = "Level 2: Developing Foveal Fixation";
      practiceAdvice = "30 minutes daily with patching.";
    }

    const report = `Session complete! You found ${targetsFound} targets with ${accuracy}% accuracy. Your visual discrimination is currently at ${tier}. To reach the next level, you need ${practiceAdvice}`;

    setEvaluationText(report);
    speak(report);
  }, [score, sizeLevel, targetsFound, wrongClicks, speak]);

  // Countdown timer
  useEffect(() => {
    if (sessionCompleted || secondsRemaining <= 0) {
      if (secondsRemaining <= 0 && !sessionCompleted) finishSession();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, sessionCompleted, finishSession]);

  // Build grid
  const buildGrid = useCallback(
    (width: number, height: number, level: number) => {
      const preset = SIZE_PRESETS[level] || SIZE_PRESETS[2];
      const { rows, cols } = preset;

      const faces: GridFace[] = [];
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      const radius = Math.min(cellWidth, cellHeight) * 0.42;

      const totalCells = rows * cols;
      const targetCount = Math.max(8, Math.floor(totalCells * 0.1));
      const happyIndices = new Set<number>();
      while (happyIndices.size < targetCount) {
        happyIndices.add(Math.floor(Math.random() * totalCells));
      }

      let id = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          faces.push({
            id,
            row: r,
            col: c,
            x: c * cellWidth + cellWidth / 2,
            y: r * cellHeight + cellHeight / 2,
            radius,
            type: happyIndices.has(id) ? "happy" : "sad",
            popped: false,
            isWrongShake: false,
          });
          id++;
        }
      }

      gridRef.current = faces;
      setTotalTargetsRemaining(targetCount);
    },
    []
  );

  const getOutlineColor = useCallback(
    (isShake?: boolean) => {
      if (isShake) return "#ffffff";
      const factor = intensity / 100;

      if (colorTheme === "red") {
        const rVal = Math.round(255 * factor);
        return `rgb(${rVal}, 0, 0)`;
      } else if (colorTheme === "cyan") {
        const bVal = Math.round(255 * factor);
        const gVal = Math.round(38 * factor);
        return `rgb(0, ${gVal}, ${bVal})`;
      } else {
        const rVal = Math.round(245 * factor);
        const gVal = Math.round(190 * factor);
        const bVal = Math.round(56 * factor);
        return `rgb(${rVal}, ${gVal}, ${bVal})`;
      }
    },
    [colorTheme, intensity]
  );

  const drawFace = useCallback(
    (ctx: CanvasRenderingContext2D, face: GridFace) => {
      if (face.popped) return;

      const { x, y, radius: r, type, isWrongShake } = face;
      const strokeColor = getOutlineColor(isWrongShake);

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = isWrongShake ? 3 : Math.max(r * 0.1, 1.6);
      ctx.lineCap = "round";

      // 1. Circle Outline
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Eyes
      const eyeOffsetX = r * 0.32;
      const eyeOffsetY = r * 0.22;
      const eyeRadius = Math.max(r * 0.1, 1.8);

      ctx.beginPath();
      ctx.arc(x - eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Mouth
      if (type === "happy") {
        ctx.beginPath();
        ctx.arc(x, y + r * 0.08, r * 0.48, 0.2 * Math.PI, 0.8 * Math.PI, false);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y + r * 0.55, r * 0.44, 1.2 * Math.PI, 1.8 * Math.PI, false);
        ctx.stroke();
      }
    },
    [getOutlineColor]
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gridRef.current.forEach((face) => {
      drawFace(ctx, face);
    });
  }, [drawFace]);

  useEffect(() => {
    const initOrResize = (forceNewGrid = false) => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;

      if (!isInitializedRef.current || forceNewGrid) {
        buildGrid(rect.width, rect.height, sizeLevel);
        isInitializedRef.current = true;
      } else {
        const preset = SIZE_PRESETS[sizeLevel] || SIZE_PRESETS[2];
        const cellWidth = rect.width / preset.cols;
        const cellHeight = rect.height / preset.rows;
        const radius = Math.min(cellWidth, cellHeight) * 0.42;

        gridRef.current.forEach((face) => {
          face.x = face.col * cellWidth + cellWidth / 2;
          face.y = face.row * cellHeight + cellHeight / 2;
          face.radius = radius;
        });
      }

      render();
    };

    initOrResize(false);

    const handleResize = () => initOrResize(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildGrid, render, sizeLevel]);

  useEffect(() => {
    if (!canvasRef.current) return;
    buildGrid(canvasRef.current.width, canvasRef.current.height, sizeLevel);
    render();
  }, [sizeLevel, buildGrid, render]);

  useEffect(() => {
    render();
  }, [intensity, render]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (sessionCompleted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let remainingHappy = 0;
    let stateChanged = false;

    gridRef.current.forEach((face) => {
      if (face.popped) return;

      const dist = Math.hypot(face.x - clickX, face.y - clickY);

      if (dist <= face.radius) {
        if (face.type === "happy") {
          face.popped = true;
          setScore((s) => s + 20);
          setTargetsFound((t) => t + 1);
          stateChanged = true;
        } else {
          face.isWrongShake = true;
          setScore((s) => Math.max(0, s - 5));
          setWrongClicks((w) => w + 1);
          stateChanged = true;

          setTimeout(() => {
            face.isWrongShake = false;
            render();
          }, 250);
        }
      }

      if (face.type === "happy" && !face.popped) {
        remainingHappy++;
      }
    });

    if (stateChanged) {
      setTotalTargetsRemaining(remainingHappy);
      render();

      if (remainingHappy === 0) {
        speak("Great job clearing this board! Loading next level.");
        setTimeout(() => {
          if (canvasRef.current) {
            buildGrid(canvasRef.current.width, canvasRef.current.height, sizeLevel);
            render();
          }
        }, 400);
      }
    }
  };

  const formatSecs = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const currentPreset = SIZE_PRESETS[sizeLevel] || SIZE_PRESETS[2];
  const accentColor =
    colorTheme === "red" ? "#ff0000" : colorTheme === "cyan" ? "#0026ff" : "#f5be38";

  return (
    <div className={styles.modalOverlay}>
      <header className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <span className={styles.gameTitle} style={{ color: accentColor }}>
            😊 Smiley ({colorTheme === "red" ? "Red Outline" : colorTheme === "cyan" ? "Blue Outline" : "Monocular"})
          </span>
          <span className={styles.badge} style={{ borderColor: accentColor }}>
            {activeEye}
          </span>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Size:</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={sizeLevel}
              onChange={(e) => setSizeLevel(Number(e.target.value))}
              className={styles.slider}
              style={{ accentColor }}
            />
            <span className={styles.valueBadge} style={{ color: accentColor }}>
              {currentPreset.label}
            </span>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Brightness:</span>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className={styles.slider}
              style={{ accentColor }}
            />
            <span className={styles.valueBadge} style={{ color: accentColor }}>
              {intensity}%
            </span>
          </div>
        </div>

        <div className={styles.statsCluster}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Happy Left</span>
            <span className={styles.statValue} style={{ color: accentColor }}>
              {totalTargetsRemaining}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Score</span>
            <span className={styles.statValue}>{score}</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Session</span>
            <span className={styles.statValue}>{formatSecs(secondsRemaining)}</span>
          </div>

          <button onClick={finishSession} className={styles.exitBtn}>
            {sessionCompleted ? "Close ✕" : "Finish & Evaluate"}
          </button>
        </div>
      </header>

      <main ref={containerRef} className={styles.stageArea}>
        <div className={styles.patchAlert} style={{ borderLeft: `4px solid ${accentColor}` }}>
          {colorTheme === "red"
            ? "👓 WEAR RED-CYAN GLASSES! (Red lens over Right Eye)"
            : colorTheme === "cyan"
            ? "👓 WEAR RED-CYAN GLASSES! (Blue/Cyan lens over Left Eye)"
            : `⚠️ PATCH YOUR ${activeEye === "Monocular Left" ? "RIGHT" : "LEFT"} EYE!`}
        </div>

        <canvas ref={canvasRef} onClick={handleCanvasClick} className={styles.canvas} />

        {/* Post-Session Automated Evaluation Modal */}
        {sessionCompleted && evaluationText && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(3, 5, 12, 0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              zIndex: 50,
            }}
          >
            <div
              style={{
                maxWidth: "540px",
                background: "#0c1124",
                border: "2px solid #28376d",
                borderRadius: "20px",
                padding: "2.5rem",
                textAlign: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏆</div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8", marginBottom: "1rem" }}>
                Session Evaluation
              </h2>
              <p style={{ color: "#e2e8f0", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                {evaluationText}
              </p>
              <button
                onClick={onClose}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "0.9rem 2.2rem",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Return to Therapy Suite
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
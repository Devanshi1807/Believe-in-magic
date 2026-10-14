// app/therapy/components/games/CatchFruitsGame.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CatchFruitsGame.module.css";
import { useVoiceAssistant } from "@/app/context/VoiceAssistantContext";

// app/therapy/components/games/CatchFruitsGame.tsx

interface CatchFruitsGameProps {
  activeEye: string;
  durationMinutes: number;
  colorTheme?: "yellow" | "red" | "cyan" | "dual"; // Accepts all 4 themes without type conflict
  onClose: () => void;
}

interface FallingFruit {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  fruitType: "apple" | "orange" | "berry";
}

export default function CatchFruitsGame({
  activeEye,
  durationMinutes,
  colorTheme = "yellow",
  onClose,
}: CatchFruitsGameProps) {
  const { speak, stop } = useVoiceAssistant();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Brightness / Contrast intensity slider (10% to 100%)
  const [intensity, setIntensity] = useState<number>(100);

  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [missedCount, setMissedCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationMinutes * 60);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [evaluationText, setEvaluationText] = useState<string | null>(null);

  const bucketXRef = useRef<number>(400);
  const fruitsRef = useRef<FallingFruit[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  const patchedEye = activeEye === "Monocular Left" ? "RIGHT" : "LEFT";
  const isGlasses = colorTheme === "red" || colorTheme === "cyan";

  // Voice instructions on start
  useEffect(() => {
    let instruction = "";
    if (colorTheme === "red") {
      instruction = `Catch the Fruits in Red Mode. Put on your Red-Cyan glasses with the red lens on your right eye. Move your mouse or finger left and right to catch the falling red fruits in your bucket.`;
    } else if (colorTheme === "cyan") {
      instruction = `Catch the Fruits in Blue Mode. Put on your Red-Cyan glasses with the blue lens on your left eye. Move the bucket to catch each falling blue fruit.`;
    } else {
      instruction = `Catch the Fruits Monocular training. Please patch your ${patchedEye} eye completely. Track the fruits as they fall and move the bucket left and right to catch them.`;
    }

    speak(instruction);
    return () => stop();
  }, [colorTheme, patchedEye, speak, stop]);

  // Automated post-session diagnostic evaluation
  const finishSession = useCallback(() => {
    setSessionCompleted(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const total = caughtCount + missedCount;
    const accuracy = total > 0 ? Math.round((caughtCount / total) * 100) : 100;

    let tier = "Level 1: Basic Pursuit Tracking";
    let advice = "25 minutes daily pursuit practice.";

    if (caughtCount >= 35 && accuracy >= 85) {
      tier = "Level 5: Master Dynamic Visual Tracking";
      advice = "15 minutes maintenance daily.";
    } else if (caughtCount >= 25 && accuracy >= 75) {
      tier = "Level 4: Advanced Oculomotor Pursuit";
      advice = "20 minutes daily.";
    } else if (caughtCount >= 15) {
      tier = "Level 3: Intermediate Visual Localization";
      advice = "20 minutes daily.";
    } else if (caughtCount >= 8) {
      tier = "Level 2: Developing Smooth Saccades";
      advice = "25 minutes daily.";
    }

    const evaluation = `Great job! You caught ${caughtCount} fruits with an accuracy of ${accuracy}%. Your tracking ability is at ${tier}. Recommended prescription: ${advice}`;

    setEvaluationText(evaluation);
    speak(evaluation);
  }, [caughtCount, missedCount, speak]);

  // Session timer
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

  // Color generator based on theme and contrast intensity
  const getPalette = useCallback(() => {
    const factor = intensity / 100;

    if (colorTheme === "red") {
      const r = Math.round(255 * factor);
      return {
        bucketFill: `rgba(${r}, 0, 0, 0.25)`,
        bucketStroke: `rgb(${r}, 0, 0)`,
        fruitStroke: `rgb(${r}, 0, 0)`,
        fruitFill: `rgba(${r}, 0, 0, 0.15)`,
        accent: `rgb(${r}, 0, 0)`,
      };
    } else if (colorTheme === "cyan") {
      const b = Math.round(255 * factor);
      const g = Math.round(38 * factor);
      return {
        bucketFill: `rgba(0, ${g}, ${b}, 0.25)`,
        bucketStroke: `rgb(0, ${g}, ${b})`,
        fruitStroke: `rgb(0, ${g}, ${b})`,
        fruitFill: `rgba(0, ${g}, ${b}, 0.15)`,
        accent: `rgb(0, ${g}, ${b})`,
      };
    } else {
      // Monocular vibrant palette
      return {
        bucketFill: "rgba(245, 190, 56, 0.35)",
        bucketStroke: "#f5be38",
        fruitStroke: "#38bdf8",
        fruitFill: "#ef4444",
        accent: "#f5be38",
      };
    }
  }, [colorTheme, intensity]);

  // Main canvas animation & collision loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let fruitIdCounter = 0;

    const gameLoop = (timestamp: number) => {
      // Clear canvas with pure black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const palette = getPalette();

      // Spawn falling fruit every ~1.2 seconds
      if (timestamp - lastSpawnRef.current > 1200) {
        lastSpawnRef.current = timestamp;
        const types: ("apple" | "orange" | "berry")[] = ["apple", "orange", "berry"];
        fruitsRef.current.push({
          id: fruitIdCounter++,
          x: Math.random() * (canvas.width - 80) + 40,
          y: -25,
          radius: 18,
          speed: 2.5 + Math.random() * 2, // Smooth pursuit velocity
          fruitType: types[Math.floor(Math.random() * types.length)],
        });
      }

      // Draw Bucket
      const bucketWidth = 110;
      const bucketHeight = 45;
      const bucketY = canvas.height - bucketHeight - 25;
      const bx = bucketXRef.current - bucketWidth / 2;

      ctx.beginPath();
      ctx.roundRect(bx, bucketY, bucketWidth, bucketHeight, [4, 4, 16, 16]);
      ctx.fillStyle = palette.bucketFill;
      ctx.fill();
      ctx.strokeStyle = palette.bucketStroke;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bucket rim line
      ctx.beginPath();
      ctx.moveTo(bx - 6, bucketY);
      ctx.lineTo(bx + bucketWidth + 6, bucketY);
      ctx.lineWidth = 4;
      ctx.stroke();

      // Update & Draw Falling Fruits
      const updatedFruits: FallingFruit[] = [];

      for (const fruit of fruitsRef.current) {
        fruit.y += fruit.speed;

        // Collision Check with Bucket
        const isWithinX = fruit.x >= bx - 5 && fruit.x <= bx + bucketWidth + 5;
        const isWithinY = fruit.y + fruit.radius >= bucketY && fruit.y - fruit.radius <= bucketY + bucketHeight;

        if (isWithinX && isWithinY) {
          // CAUGHT!
          setCaughtCount((c) => c + 1);
          setScore((s) => s + 10);
          continue; // Fruit removed
        }

        // Missed (Fell through the floor)
        if (fruit.y - fruit.radius > canvas.height) {
          setMissedCount((m) => m + 1);
          continue;
        }

        // Render Fruit
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);

        if (colorTheme === "yellow") {
          ctx.fillStyle = fruit.fruitType === "apple" ? "#ef4444" : fruit.fruitType === "orange" ? "#f97316" : "#a855f7";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Stem
          ctx.beginPath();
          ctx.moveTo(fruit.x, fruit.y - fruit.radius);
          ctx.lineTo(fruit.x + 4, fruit.y - fruit.radius - 6);
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // MFBF Red/Blue Anaglyph Outlines
          ctx.fillStyle = palette.fruitFill;
          ctx.fill();
          ctx.strokeStyle = palette.fruitStroke;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Outline stem
          ctx.beginPath();
          ctx.moveTo(fruit.x, fruit.y - fruit.radius);
          ctx.lineTo(fruit.x + 3, fruit.y - fruit.radius - 5);
          ctx.stroke();
        }

        updatedFruits.push(fruit);
      }

      fruitsRef.current = updatedFruits;

      if (!sessionCompleted) {
        animFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [getPalette, sessionCompleted, colorTheme]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      bucketXRef.current = rect.width / 2;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track cursor/touch horizontally
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    bucketXRef.current = Math.max(55, Math.min(rect.width - 55, mouseX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !e.touches[0]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    bucketXRef.current = Math.max(55, Math.min(rect.width - 55, touchX));
  };

  const formatSecs = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const accentColor =
    colorTheme === "red" ? "#ff0000" : colorTheme === "cyan" ? "#0026ff" : "#f5be38";

  return (
    <div className={styles.modalOverlay}>
      <header className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <span className={styles.gameTitle} style={{ color: accentColor }}>
            🍎 Catch the Fruits {isGlasses ? `(${colorTheme === "red" ? "Red Glass" : "Blue Glass"})` : "(Monocular)"}
          </span>
          <span className={styles.badge} style={{ borderColor: accentColor }}>
            {activeEye}
          </span>

          {/* Brightness / Contrast Slider */}
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
            <span className={styles.statLabel}>Fruits Caught</span>
            <span className={styles.statValue} style={{ color: accentColor }}>
              {caughtCount}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Missed</span>
            <span className={styles.statValue} style={{ color: "#94a3b8" }}>
              {missedCount}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Score</span>
            <span className={styles.statValue}>{score}</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Time Left</span>
            <span className={styles.statValue}>{formatSecs(secondsRemaining)}</span>
          </div>

          <button onClick={finishSession} className={styles.exitBtn}>
            {sessionCompleted ? "Close ✕" : "Finish & Evaluate"}
          </button>
        </div>
      </header>

      <main
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className={styles.stageArea}
      >
        <div className={styles.patchAlert} style={{ borderLeft: `4px solid ${accentColor}` }}>
          {colorTheme === "red"
            ? "👓 WEAR RED-CYAN GLASSES! (Red lens over Right Eye)"
            : colorTheme === "cyan"
            ? "👓 WEAR RED-CYAN GLASSES! (Blue/Cyan lens over Left Eye)"
            : `⚠️ PATCH YOUR ${activeEye === "Monocular Left" ? "RIGHT" : "LEFT"} EYE!`}
        </div>

        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Post-Session Evaluation Modal */}
        {sessionCompleted && evaluationText && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(3, 5, 12, 0.94)",
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
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🧺</div>
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
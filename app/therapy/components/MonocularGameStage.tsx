"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./MonocularGameStage.module.css";

interface MonocularGameStageProps {
  gameTitle: string;
  activeEye: string;
  durationMinutes: number;
  onClose: () => void;
}

export default function MonocularGameStage({
  gameTitle,
  activeEye,
  durationMinutes,
  onClose,
}: MonocularGameStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);

  const patchedEye = activeEye === "Monocular Left" ? "RIGHT" : "LEFT";

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 480;

    let targets = Array.from({ length: 5 }, () => ({
      x: Math.random() * 700 + 50,
      y: Math.random() * 380 + 50,
      radius: 26,
      dx: (Math.random() - 0.5) * 3.5,
      dy: (Math.random() - 0.5) * 3.5,
      letter: ["E", "C", "O", "X"][Math.floor(Math.random() * 4)],
    }));

    let animId: number;

    const render = () => {
      ctx.fillStyle = "#090d1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Moving targets
      targets.forEach((t) => {
        t.x += t.dx;
        t.y += t.dy;

        if (t.x - t.radius < 0 || t.x + t.radius > canvas.width) t.dx *= -1;
        if (t.y - t.radius < 0 || t.y + t.radius > canvas.height) t.dy *= -1;

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#090d1a";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(t.letter, t.x, t.y);
      });

      animId = requestAnimationFrame(render);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      targets = targets.map((t) => {
        if (Math.hypot(t.x - clickX, t.y - clickY) <= t.radius + 8) {
          setScore((s) => s + 10);
          return {
            x: Math.random() * 700 + 50,
            y: Math.random() * 380 + 50,
            radius: 26,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            letter: ["E", "C", "O", "X"][Math.floor(Math.random() * 4)],
          };
        }
        return t;
      });
    };

    canvas.addEventListener("click", handleClick);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  const formatSecs = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className={styles.modal}>
      <header className={styles.header}>
        <span className={styles.title}>
          {gameTitle} — {activeEye} | Score: {score} | Time: {formatSecs(secondsRemaining)}
        </span>
        <button onClick={onClose} className={styles.exitBtn}>
          Exit Session ✕
        </button>
      </header>

      <div className={styles.stage}>
        <div className={styles.patchNotice}>
          ⚠️ PATCH YOUR {patchedEye} EYE! Focus using only your active training eye.
        </div>
        <canvas ref={canvasRef} style={{ border: "2px solid #1e2b58", borderRadius: 12 }} />
      </div>
    </div>
  );
}
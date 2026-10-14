// app/dashboard/components/IntakeModal.tsx
"use client";

import React, { useState } from "react";
import styles from "./IntakeModal.module.css";

interface IntakeModalProps {
  onComplete: (data: { name: string; age: number; gender: string }) => void;
}

export default function IntakeModal({ onComplete }: IntakeModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("8");
  const [gender, setGender] = useState("Prefer not to say");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      age: parseInt(age) || 8,
      gender,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>Patient Registration</span>
          <h2 className={styles.title}>Welcome to Care</h2>
          <p className={styles.subtitle}>
            Please enter your patient details to establish your visual baseline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Patient Full Name</label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className={styles.field}>
              <label className={styles.label}>Age</label>
              <input
                type="number"
                min="3"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={styles.select}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className={styles.assignedDoctorBox}>
            <span style={{ fontSize: "1.5rem" }}>👩‍⚕️</span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
                Assigned Therapist: Dr. Iris
              </div>
              <div style={{ fontSize: "0.74rem", color: "#2dd4bf" }}>
                Pediatric Vision & Binocular Specialist
              </div>
            </div>
          </div>

          <button type="submit" disabled={!name.trim()} className={styles.submitBtn}>
            Enter Clinical Suite →
          </button>
        </form>
      </div>
    </div>
  );
}
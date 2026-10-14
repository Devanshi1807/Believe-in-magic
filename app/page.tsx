// app/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard/components/IntakeModal.module.css";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("8");
  const [gender, setGender] = useState("Prefer not to say");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Persist patient profile
    localStorage.setItem("bim_patient_name", name.trim());
    localStorage.setItem("bim_patient_age", age);
    localStorage.setItem("bim_patient_gender", gender);
    localStorage.setItem("bim_patient_email", email || "patient@example.com");

    // Route to dashboard
    router.push("/dashboard");
  };

  return (
    <div className={styles.overlay} style={{ minHeight: "100vh", position: "relative" }}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>
            {isSignUp ? "Patient Sign Up" : "Patient Sign In"}
          </span>
          <h2 className={styles.title}>Believe in Magic</h2>
          <p className={styles.subtitle}>
            Pediatric Vision Therapy & AI Clinical Assistant
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Patient Full Name</label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
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
                Pediatric Vision Specialist
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isSignUp ? "Sign Up & Open Dashboard →" : "Sign In & Open Dashboard →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: "transparent",
                border: "none",
                color: "#38bdf8",
                fontSize: "0.84rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
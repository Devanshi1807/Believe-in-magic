"use client";

import React, { useState } from "react";
import styles from "./WelcomeGate.module.css";

interface WelcomeGateProps {
  initialName: string;
  onProceed: (name: string) => void;
}

export default function WelcomeGate({ initialName, onProceed }: WelcomeGateProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onProceed(name.trim());
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Welcome</h1>
        <p className={styles.subtext}>
          Please enter your full name to initialize your personalized vision therapy session.
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="patientNameInput" className={styles.label}>
            Your Name
          </label>
          <input
            id="patientNameInput"
            type="text"
            placeholder="Enter patient name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            autoFocus
          />
        </div>

        <button type="submit" disabled={!name.trim()} className={styles.proceedBtn}>
          Proceed →
        </button>
      </form>
    </div>
  );
}
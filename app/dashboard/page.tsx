// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import TherapistRoomView from "./components/TherapistRoomView";
import AssignedTherapiesView from "./components/AssignedTherapiesView";
import ProgressTrackerView from "./components/ProgressTrackerView";

// Games (for launching directly from Assigned Therapies)
import SmileyGame from "../therapy/components/games/SmileyGame";
import CatchFruitsGame from "../therapy/components/games/CatchFruitsGame";

export default function DashboardPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<{
    name: string;
    age: number;
    gender: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"therapist" | "assigned" | "progress">("therapist");

  const [activeGame, setActiveGame] = useState<{
    gameName: string;
    eye: string;
    colorTheme?: "yellow" | "red" | "cyan" | "dual";
  } | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("bim_patient_name");
    const savedAge = localStorage.getItem("bim_patient_age");
    const savedGender = localStorage.getItem("bim_patient_gender");

    if (savedName) {
      setPatientData({
        name: savedName,
        age: savedAge ? parseInt(savedAge, 10) : 8,
        gender: savedGender || "Prefer not to say",
      });
    } else {
      // If no user is logged in, return to auth entry page
      router.push("/");
    }
  }, [router]);

  const navItems = [
    { id: "therapist", label: "Therapist Room", icon: "🩺" },
    { id: "report", label: "Your Clinical Eye Report", icon: "📄" },
    { id: "assigned", label: "Therapies Assigned", icon: "📋" },
    { id: "zone", label: "Enter Therapy Zone", icon: "🎮" },
    { id: "progress", label: "Progress Tracker", icon: "📈" },
  ];

  const handleNavClick = (id: string) => {
    if (id === "report") {
      // Direct navigation to upload report
      router.push("/upload-report");
    } else if (id === "zone") {
      // Direct navigation to /therapy with all therapies
      router.push("/therapy");
    } else {
      setActiveTab(id as "therapist" | "assigned" | "progress");
    }
  };

  return (
    <div className={styles.container}>
      {/* Calm Medical Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brandCard}>
          <div className={styles.brandTitle}>
            <span>✨</span> Believe in Magic
          </div>
          <div className={styles.brandSubtitle}>Pediatric Vision Suite</div>

          {patientData && (
            <div className={styles.patientPill}>
              <div className={styles.patientAvatar}>{patientData.name.charAt(0)}</div>
              <div className={styles.patientInfo}>
                <span className={styles.patientName}>{patientData.name}</span>
                <span className={styles.patientMeta}>
                  Age {patientData.age} • {patientData.gender}
                </span>
              </div>
            </div>
          )}
        </div>

        <nav className={styles.navSection}>
          <div className={styles.navSectionLabel}>Patient Menu</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`${styles.navButton} ${
                activeTab === item.id ? styles.navButtonActive : ""
              }`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.doctorFooter}>
          <div className={styles.doctorAvatar}>👩‍⚕️</div>
          <div className={styles.doctorDetails}>
            <span className={styles.doctorName}>Dr. Iris</span>
            <span className={styles.doctorSpecialty}>Assigned AI Specialist</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <h1 className={styles.pageHeading}>
            {navItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <div className={styles.topBarBadges}>
            <span className={styles.statusBadge}>● Active Session</span>
          </div>
        </header>

        <div className={styles.workspaceArea}>
          {activeTab === "therapist" && (
            <TherapistRoomView patientName={patientData?.name || ""} />
          )}

{activeTab === "assigned" && (
            <AssignedTherapiesView
              onEnterGame={(gameName: string, modality: string, colorTheme?: any) => {
                setActiveGame({
                  gameName,
                  eye: modality,
                  colorTheme:
                    colorTheme || (gameName.includes("Dual") ? "dual" : "yellow"),
                });
              }}
            />
          )}

          {activeTab === "progress" && <ProgressTrackerView />}
        </div>
      </main>

      {/* Launch game modal when user clicks 'Start Session' from Assigned Therapies */}
      {activeGame && (
        <>
          {activeGame.gameName.startsWith("Smiley") ? (
            <SmileyGame
              activeEye={activeGame.eye}
              durationMinutes={5}
              colorTheme={activeGame.colorTheme as any}
              onClose={() => setActiveGame(null)}
            />
          ) : (
            <CatchFruitsGame
              activeEye={activeGame.eye}
              durationMinutes={5}
              colorTheme={activeGame.colorTheme as any}
              onClose={() => setActiveGame(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
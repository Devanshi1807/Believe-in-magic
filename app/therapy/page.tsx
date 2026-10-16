// app/therapy/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./therapy.module.css";

// Game Canvases
import SmileyGame from "./components/games/SmileyGame";
import CatchFruitsGame from "./components/games/CatchFruitsGame";

export default function TherapyPage() {
  const router = useRouter();

  const [patientName, setPatientName] = useState("Shreya");
  const [activeTab, setActiveTab] = useState("Monocular");
  const [selectedProtocolId, setSelectedProtocolId] = useState(1);

  // Active game modal state
  const [activeSession, setActiveSession] = useState<{
    gameName: string;
    eye: string;
    duration: number;
    colorTheme?: "yellow" | "red" | "cyan" | "dual";
  } | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("bim_patient_name");
    if (savedName) setPatientName(savedName);
  }, []);

  const therapyNavItems = [
    { id: "Monocular", label: "Monocular", icon: "👁️" },
    { id: "MFBF", label: "MFBF", icon: "👓" },
    { id: "Dichoptics", label: "Dichoptics", icon: "🕶️" },
    { id: "Anti-suppression", label: "Anti-suppression", icon: "🎯" },
    { id: "Stereopsis Near", label: "Stereopsis Near", icon: "📦" },
    { id: "Stereopsis Far", label: "Stereopsis Far", icon: "🧊" },
    { id: "Accommodation", label: "Accommodation", icon: "🧭" },
    { id: "Non Motor Perception", label: "Non Motor Perception", icon: "🧠" },
    { id: "Visual Perception", label: "Visual Perception", icon: "👁️" },
    { id: "Motor Pursuit", label: "Motor Pursuit", icon: "〰️" },
    { id: "Motor Saccades", label: "Motor Saccades", icon: "↔️" },
    { id: "Motor Rotational Dots", label: "Motor Rotational Dots", icon: "🔘" },
    { id: "Diagnostics", label: "Diagnostics", icon: "📋" },
  ];

  const protocols = [
    {
      id: 1,
      title: "Start Protocol 1",
      difficulty: "Beginner",
      diffBg: "#e0f2fe",
      diffColor: "#0284c7",
      iconBg: "#3b82f6",
      iconColor: "#ffffff",
      icon: "👁️",
      desc: "Focus training with simple visual tasks",
      gameName: "Smiley",
      eye: "Monocular Left",
      colorTheme: "yellow" as const,
    },
    {
      id: 2,
      title: "Start Protocol 2",
      difficulty: "Intermediate",
      diffBg: "#ede9fe",
      diffColor: "#7c3aed",
      iconBg: "#8b5cf6",
      iconColor: "#ffffff",
      icon: "👁️",
      desc: "Improve contrast and visual tracking",
      gameName: "Catch the Fruits",
      eye: "Monocular Left",
      colorTheme: "yellow" as const,
    },
    {
      id: 3,
      title: "Start Protocol 3",
      difficulty: "Intermediate",
      diffBg: "#e0f2fe",
      diffColor: "#0284c7",
      iconBg: "#10b981",
      iconColor: "#ffffff",
      icon: "🎯",
      desc: "Enhance focus and eye coordination",
      gameName: "Smiley",
      eye: "Monocular Right",
      colorTheme: "yellow" as const,
    },
    {
      id: 4,
      title: "Start Protocol 4",
      difficulty: "Advanced",
      diffBg: "#fee2e2",
      diffColor: "#dc2626",
      iconBg: "#f87171",
      iconColor: "#ffffff",
      icon: "✨",
      desc: "Build stability and visual endurance",
      gameName: "Catch the Fruits",
      eye: "Monocular Right",
      colorTheme: "yellow" as const,
    },
    {
      id: 5,
      title: "Start Protocol 5",
      difficulty: "Advanced",
      diffBg: "#ede9fe",
      diffColor: "#7c3aed",
      iconBg: "#a855f7",
      iconColor: "#ffffff",
      icon: "🏔️",
      desc: "Complex visual processing and depth",
      gameName: "Smiley Dual-Tone",
      eye: "MFBF Left",
      colorTheme: "dual" as const,
    },
  ];

  return (
    <div className={styles.container}>
      {/* 1. LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>🌙</div>
          <div>
            <div className={styles.brandTitle}>
              Believe in Magic<span className={styles.brandStar}>✦</span>
            </div>
            <div className={styles.brandTagline}>Vision Therapy for a Brighter Tomorrow</div>
          </div>
        </div>

        <div className={styles.navScrollArea}>
          <button onClick={() => router.push("/dashboard")} className={styles.navItem}>
            <span className={styles.navIcon}>🏠</span>
            <span>Home</span>
          </button>

          <div className={styles.navSectionLabel}>Therapies</div>
          {therapyNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className={styles.navSectionLabel}>Progress</div>
          <button onClick={() => router.push("/dashboard")} className={styles.navItem}>
            <span className={styles.navIcon}>📊</span>
            <span>My Progress</span>
          </button>
          <button onClick={() => router.push("/upload-report")} className={styles.navItem}>
            <span className={styles.navIcon}>📄</span>
            <span>Reports</span>
          </button>
        </div>

        {/* Motivational Card at Bottom */}
        <div className={styles.sidebarFooterCard}>
          <div className={styles.sidebarFooterStar}>✦</div>
          <div className={styles.sidebarFooterHeading}>Small steps make big changes.</div>
          <div className={styles.sidebarFooterSub}>You're doing great!</div>
          <div className={styles.sidebarFooterHeart}>💜</div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.greetingBox}>
            <div className={styles.greetingTitle}>
              Good Morning, <span className={styles.greetingName}>{patientName}</span> ☀️
            </div>
            <div className={styles.greetingSubtitle}>
              Let's work towards clearer vision, one step at a time.
            </div>
          </div>

          <div className={styles.topHeaderActions}>
            <button onClick={() => router.push("/dashboard")} className={styles.backBtn}>
              ← Back to Dashboard
            </button>
            <div className={styles.notificationIcon}>
              🔔
              <span className={styles.notificationBadge} />
            </div>
            <div className={styles.userAvatar}>
              {patientName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className={styles.scrollBody}>
          {/* Hero Banner */}
          <section className={styles.heroBanner}>
            <div className={styles.heroLeft}>
              <div className={styles.heroTitleRow}>
                <div className={styles.heroIconCircle}>👁️</div>
                <div className={styles.heroHeaderTexts}>
                  <div className={styles.heroMainTitle}>
                    <span>{activeTab} Therapy</span>
                    <span className={styles.recommendedPill}>★ Recommended</span>
                  </div>
                  <div className={styles.heroSubtext}>
                    Train your weaker eye. Build stronger vision.
                  </div>
                </div>
              </div>

              {/* Parameter Indicators */}
              <div className={styles.heroParamsRow}>
                <div className={styles.paramItem}>
                  <span className={styles.paramIcon}>⏱️</span>
                  <div className={styles.paramTexts}>
                    <span className={styles.paramLabel}>Duration</span>
                    <span className={styles.paramValue}>3 min</span>
                  </div>
                </div>

                <div className={styles.paramItem}>
                  <span className={styles.paramIcon}>⚙️</span>
                  <div className={styles.paramTexts}>
                    <span className={styles.paramLabel}>Baseline Acuity</span>
                    <span className={styles.paramValue}>20/60</span>
                  </div>
                </div>

                <div className={styles.paramItem}>
                  <span className={styles.paramIcon}>📊</span>
                  <div className={styles.paramTexts}>
                    <span className={styles.paramLabel}>Difficulty</span>
                    <span className={styles.paramValue}>Easy</span>
                  </div>
                </div>

                <div className={styles.paramItem}>
                  <span className={styles.paramIcon}>📦</span>
                  <div className={styles.paramTexts}>
                    <span className={styles.paramLabel}>Field</span>
                    <span className={styles.paramValue}>Dark Field</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Illustration Scene */}
            <div className={styles.heroArtSide}>
              <div className={styles.artHill} />
              <div className={styles.characterBody}>
                <div className={styles.characterPupil}>
                  <div className={styles.characterLight} />
                </div>
                <span className={styles.characterStar}>⭐</span>
              </div>
            </div>
          </section>

          {/* Two-Column Grid: Protocols (Left) vs Widgets (Right) */}
          <div className={styles.contentGrid}>
            {/* Left Column: Protocols */}
            <div className={styles.leftColumn}>
              {/* About Card */}
              <div className={styles.aboutCard}>
                <div className={styles.aboutHeader}>
                  <span style={{ color: "#2563eb" }}>ℹ️</span> About This Therapy
                </div>
                <div className={styles.aboutText}>
                  {activeTab} therapy helps improve vision in the weaker eye by training it
                  individually. It enhances focus, eye movement, and visual processing.
                </div>
              </div>

              {/* Protocols List */}
              <div className={styles.protocolsSection}>
                <div className={styles.protocolsTitleRow}>
                  <span>🔲</span> Choose Your Protocol
                </div>

                <div className={styles.protocolsList}>
                  {protocols.map((p) => {
                    const isSelected = selectedProtocolId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProtocolId(p.id);
                          setActiveSession({
                            gameName: p.gameName,
                            eye: p.eye,
                            duration: 3,
                            colorTheme: p.colorTheme,
                          });
                        }}
                        className={`${styles.protocolItem} ${
                          isSelected ? styles.protocolItemActive : ""
                        }`}
                      >
                        <div
                          className={styles.protocolIconCircle}
                          style={{ background: p.iconBg, color: p.iconColor }}
                        >
                          {p.icon}
                        </div>

                        <div className={styles.protocolDetails}>
                          <div className={styles.protocolHeader}>
                            <span className={styles.protocolTitle}>{p.title}</span>
                            <span
                              className={styles.difficultyPill}
                              style={{ background: p.diffBg, color: p.diffColor }}
                            >
                              {p.difficulty}
                            </span>
                          </div>
                          <div className={styles.protocolDesc}>{p.desc}</div>
                        </div>

                        <div className={styles.protocolChevron}>›</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className={styles.rightColumn}>
              {/* 1. Progress Card */}
              <div className={styles.progressCard}>
                <div className={styles.progressCardTitle}>Your Progress</div>
                <div className={styles.progressBody}>
                  <div className={styles.circularGauge}>
                    <div className={styles.circularGaugeInner}>40%</div>
                  </div>
                  <div className={styles.progressCardText}>
                    Complete 2 more sessions to reach the next level!
                  </div>
                </div>
                <div className={styles.progressCardArrow}>↗</div>
              </div>

              {/* 2. Quick Tips Card */}
              <div className={styles.tipsCard}>
                <div className={styles.tipsHeader}>
                  <span>💡</span> Quick Tips
                </div>
                <div className={styles.tipsList}>
                  <div className={styles.tipItem}>
                    <span className={styles.tipCheck}>✓</span> Keep your head still
                  </div>
                  <div className={styles.tipItem}>
                    <span className={styles.tipCheck}>✓</span> Focus on the target
                  </div>
                  <div className={styles.tipItem}>
                    <span className={styles.tipCheck}>✓</span> Take short breaks
                  </div>
                  <div className={styles.tipItem}>
                    <span className={styles.tipCheck}>✓</span> Stay consistent
                  </div>
                </div>
              </div>

              {/* 3. Quote Card */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteLeaf}>🌱</div>
                <div className={styles.quoteText}>
                  Better vision is a journey, not a destination.
                </div>
                <div className={styles.quoteHeart}>💚</div>
              </div>

              {/* 4. Next Session Card */}
              <div className={styles.nextSessionCard}>
                <div className={styles.nextSessionHeader}>
                  <span>📅</span> Next Session
                </div>
                <div className={styles.nextSessionTitle}>Monocular Protocol 1</div>
                <div className={styles.nextSessionTime}>
                  <span>🕒</span> Tomorrow, 10:00 AM
                </div>
                <button
                  onClick={() =>
                    setActiveSession({
                      gameName: "Smiley",
                      eye: "Monocular Left",
                      duration: 3,
                      colorTheme: "yellow",
                    })
                  }
                  className={styles.startNowBtn}
                >
                  ▶ Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. CANVAS GAME MODAL LAUNCHER */}
      {activeSession && (
        <>
          {activeSession.gameName.startsWith("Smiley") ? (
            <SmileyGame
              activeEye={activeSession.eye}
              durationMinutes={activeSession.duration}
              colorTheme={activeSession.colorTheme}
              onClose={() => setActiveSession(null)}
            />
          ) : (
            <CatchFruitsGame
              activeEye={activeSession.eye}
              durationMinutes={activeSession.duration}
              colorTheme={activeSession.colorTheme as any}
              onClose={() => setActiveSession(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
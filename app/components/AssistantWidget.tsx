// app/components/AssistantWidget.tsx
"use client";

import React from "react";
import styles from "./AssistantWidget.module.css";
import { useVoiceAssistant } from "../context/VoiceAssistantContext";

export default function AssistantWidget() {
  const { isSpeaking, transcript, isMuted, toggleMute, stop } = useVoiceAssistant();

  return (
    <div className={styles.widgetContainer}>
      {transcript && isSpeaking && (
        <div className={`${styles.bubble} ${styles.interactiveArea}`}>
          <div className={styles.bubbleHeader}>
            <span className={styles.assistantName}>🤖 Iris • AI Vision Guide</span>
            <span className={styles.muteIndicator} onClick={stop}>
              ✕ Stop
            </span>
          </div>
          <div>{transcript}</div>
        </div>
      )}

      <button
        onClick={toggleMute}
        className={`${styles.avatarBtn} ${styles.interactiveArea} ${
          isSpeaking ? styles.avatarSpeaking : ""
        }`}
        title={isMuted ? "Unmute AI Assistant" : "Mute AI Assistant"}
      >
        {isMuted ? "🔇" : isSpeaking ? "🎙️" : "👩‍⚕️"}
      </button>
    </div>
  );
}
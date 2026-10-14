// app/context/VoiceAssistantContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface VoiceAssistantContextType {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
  isSpeaking: boolean;
  transcript: string;
  isMuted: boolean;
  toggleMute: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  // Stop speech
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setTranscript("");
    }
  }, []);

  const toggleMute = () => {
    if (!isMuted) stop();
    setIsMuted((prev) => !prev);
  };

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending utterances
      setTranscript(text);
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Gentle, clear clinical pace
      utterance.pitch = 1.05; // Friendly, encouraging tone

      // Select female or natural assistant voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.name.includes("Natural") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Zira") ||
          (v.lang.startsWith("en") && v.name.includes("Female"))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  return (
    <VoiceAssistantContext.Provider
      value={{ speak, stop, isSpeaking, transcript, isMuted, toggleMute }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error("useVoiceAssistant must be used within a VoiceAssistantProvider");
  }
  return context;
}
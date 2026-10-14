// app/dashboard/components/TherapistRoomView.tsx
"use client";

import React, { useState } from "react";
import { useVoiceAssistant } from "@/app/context/VoiceAssistantContext";

export default function TherapistRoomView({ patientName }: { patientName: string }) {
  const { speak } = useVoiceAssistant();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello ${patientName || "there"}! I am Dr. Iris, your vision therapist. How is your vision training feeling today? Are you experiencing any eye fatigue or blurriness during your sessions?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    // Medical response logic
    setTimeout(() => {
      let doctorReply = `I understand. When training an amblyopic eye, mild strain is normal because your visual cortex is actively building new neural pathways. Remember to take a 2-minute break if needed, and let's aim for 15 minutes of crowding exercises today.`;
      
      if (userText.toLowerCase().includes("headache") || userText.toLowerCase().includes("pain")) {
        doctorReply = `If you have a headache, please take off the patch or 3D glasses immediately and rest for 15 minutes. Eye strain is common, but discomfort should never be painful.`;
      }

      setMessages((prev) => [...prev, { role: "assistant", text: doctorReply }]);
      speak(doctorReply);
    }, 700);
  };

  return (
    <div style={{ maxWidth: 840, display: "flex", flexDirection: "column", height: "100%", gap: "1.25rem" }}>
      <div style={{ background: "#0e1424", border: "1px solid #1e2944", borderRadius: 16, padding: "1.25rem 1.75rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
          👩‍⚕️
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Consultation with Dr. Iris</h3>
          <p style={{ fontSize: "0.82rem", color: "#2dd4bf", fontWeight: 600 }}>Active Medical Session • AI Vision Specialist</p>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 380, background: "#0a0e1a", border: "1px solid #1a233a", borderRadius: 16, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", background: m.role === "user" ? "#1e3a8a" : "#141c2e", border: `1px solid ${m.role === "user" ? "#2563eb" : "#243250"}`, padding: "0.85rem 1.15rem", borderRadius: 14, color: "#f8fafc", fontSize: "0.95rem", lineHeight: 1.5 }}>
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "0.75rem" }}>
        <input
          type="text"
          placeholder="Ask Dr. Iris about your eye symptoms, fatigue, or exercises..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, background: "#0a0e1a", border: "1px solid #1e2944", borderRadius: 12, padding: "0.9rem 1.2rem", color: "#fff", fontSize: "0.95rem", outline: "none" }}
        />
        <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, padding: "0 1.5rem", fontWeight: 700, cursor: "pointer" }}>
          Send
        </button>
      </form>
    </div>
  );
}
// app/layout.tsx
import "./globals.css";
import { VoiceAssistantProvider } from "./context/VoiceAssistantContext";
import AssistantWidget from "./components/AssistantWidget";

export const metadata = {
  title: "Believe in Magic — Pediatric Vision Therapy",
  description: "Automated Clinical Amblyopia Therapy Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VoiceAssistantProvider>
          {children}
          <AssistantWidget />
        </VoiceAssistantProvider>
      </body>
    </html>
  );
}
// app/therapy/data/therapyRules.ts

export interface AssignedTherapyItem {
  id: string;
  title: string;
  gameName: string;
  gameModality: string;
  colorTheme: "yellow" | "red" | "cyan" | "dual";
  duration: string;
  badge: string;
  color: string;
  reason: string;
}

export interface ExtractedClinicalData {
  targetEye: "left" | "right";
  rightEyeOD?: string;
  leftEyeOS?: string;
  suppressionDetected?: boolean;
  crowdingSeverity?: "mild" | "moderate" | "severe";
  trackingDeficit?: boolean;
}

/**
 * Clinical prescription rules:
 * 1. Severe crowding / low baseline acuity -> High priority Monocular Smiley Matrix.
 * 2. Suppression detected -> Dual-Tone Red+Blue Smiley or MFBF monochromatic.
 * 3. Oculomotor tracking deficit -> Catch the Fruits (Pursuits).
 */
export function generatePrescriptionFromReport(
  data: ExtractedClinicalData
): AssignedTherapyItem[] {
  const isLeft = data.targetEye === "left";
  const weakEyeLabel = isLeft ? "Monocular Left" : "Monocular Right";
  const mfbfWeakLabel = isLeft ? "MFBF Left" : "MFBF Right";
  const mfbfTheme = isLeft ? "cyan" : "red";

  const assignments: AssignedTherapyItem[] = [];

  // Rule 1: Always assign Monocular Crowding Matrix for amblyopic eye foveation
  assignments.push({
    id: "prescribed_smiley_mono",
    title: "Smiley Anti-Crowding Matrix",
    gameName: "Smiley",
    gameModality: weakEyeLabel,
    colorTheme: "yellow",
    duration: "10 mins",
    badge: "Foveal Resolution",
    color: "#38bdf8",
    reason: `Targeting foveal fixational resolution for your ${
      isLeft ? "Left Eye (OS)" : "Right Eye (OD)"
    } with patching.`,
  });

  // Rule 2: If suppression is present, prioritize Dual-Tone Fusion
  if (data.suppressionDetected) {
    assignments.push({
      id: "prescribed_smiley_dual",
      title: "Smiley Dual-Tone Fusion (Red + Blue)",
      gameName: "Smiley Dual-Tone",
      gameModality: mfbfWeakLabel,
      colorTheme: "dual",
      duration: "10 mins",
      badge: "Anti-Suppression",
      color: "#c084fc",
      reason:
        "Suppression detected in optometric report. Requires simultaneous binocular viewing with Red-Cyan glasses to break cortical suppression.",
    });
  } else {
    // If no strong suppression, assign single-channel MFBF isolation
    assignments.push({
      id: "prescribed_smiley_mfbf",
      title: `Smiley (${isLeft ? "Blue" : "Red"} Channel)`,
      gameName: "Smiley",
      gameModality: mfbfWeakLabel,
      colorTheme: mfbfTheme,
      duration: "8 mins",
      badge: "MFBF Chromatic",
      color: isLeft ? "#0026ff" : "#ff0000",
      reason: `Isolates macular foveal input to your ${
        isLeft ? "Left" : "Right"
      } eye through Red-Cyan filtration.`,
    });
  }

  // Rule 3: Oculomotor / Pursuits Tracking
  assignments.push({
    id: "prescribed_fruits",
    title: "Catch the Fruits (Smooth Pursuits)",
    gameName: "Catch the Fruits",
    gameModality: weakEyeLabel,
    colorTheme: data.suppressionDetected ? mfbfTheme : "yellow",
    duration: "5 mins",
    badge: "Pursuit Coordination",
    color: "#2dd4bf",
    reason:
      "Retrains smooth ocular pursuit sweeps and dynamic hand-eye reaction speed.",
  });

  return assignments;
}
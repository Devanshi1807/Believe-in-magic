// app/therapy/data/monocularExercises.ts

export interface ExerciseGame {
  id: string;
  name: string;
  icon: string;
}

export interface ExerciseCategory {
  category: string;
  games: ExerciseGame[];
}

export const MONOCULAR_CATEGORIES: ExerciseCategory[] = [
  {
    category: "Others",
    games: [
      { id: "asteroids", name: "Shoot The Asteroids", icon: "🚀" },
      { id: "crush_letters", name: "Crush the Letters", icon: "🔤" },
      { id: "connect_letters", name: "Connect the Letters", icon: "📈" },
      { id: "hop_the_e", name: "Hop the E", icon: "🔲" },
    ],
  },
  {
    category: "Pursuits",
    games: [
      { id: "balloon_pursuit", name: "Balloon Pop Pursuit", icon: "🎈" },
      { id: "catch_fruits", name: "Catch the Fruits", icon: "🍎" },
      { id: "floating_letters", name: "Floating Letters Tachistoscope", icon: "📄" },
      { id: "match_symbol", name: "Match the Symbol Contrast", icon: "🎯" },
    ],
  },
  {
    category: "Saccades",
    games: [
      { id: "balloon_saccades", name: "Balloon Pop Saccades", icon: "💥" },
      { id: "number_text", name: "Number Text", icon: "🔢" },
      { id: "jump_letters", name: "Jump Letters Tachistoscope", icon: "🔠" },
    ],
  },
  {
    category: "Crowding",
    games: [
      { id: "smiley", name: "Smiley", icon: "😊" },
      { id: "slant_lines", name: "Match the Slant Lines", icon: "📐" },
      { id: "pattern_matching", name: "Pattern Matching", icon: "🧩" },
    ],
  },
];

export const THERAPY_SECTIONS = [
  "Monocular",
  "MFBF",
  "Dichoptics",
  "Anti-suppression",
  "Stereopsis Near",
  "Stereopsis Far",
  "Accommodation",
  "Non Motor Perception",
  "Visual Perception",
  "Motor Pursuit",
  "Motor Saccades",
  "Motor Rotational Dots",
  "Diagnostics",
];
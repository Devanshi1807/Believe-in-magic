"use client";

import React from "react";
import styles from "./Sidebar.module.css";
import { THERAPY_SECTIONS } from "../data/monocularExercises";

interface SidebarProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
}

export default function Sidebar({ selectedSection, onSelectSection }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandHeader}>
        <div className={styles.brandTitle}>Believe in magic</div>
        <div className={styles.brandEdition}>Professional Edition</div>
      </div>

      <div className={styles.sectionHeader}>Therapies</div>

      <nav className={styles.navMenu}>
        {THERAPY_SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => onSelectSection(section)}
            className={`${styles.navItem} ${
              selectedSection === section ? styles.navItemActive : ""
            }`}
          >
            {section}
          </button>
        ))}
      </nav>
    </aside>
  );
}
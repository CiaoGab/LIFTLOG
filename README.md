# LIFTLOG — Personal Workout Log (Local-First)

A fast, local-first workout logging app built for real-time set tracking, templates, history, analytics, and spreadsheet exports.

**Core goals**
- Start logging in seconds
- Save and reuse workout templates
- Track lift trends + training volume over time
- Export everything to CSV (spreadsheet-friendly)
- Local-first (no backend / no external APIs required)

---

## Features

### Workout logging
- Quick start workout or start from a template
- Log sets live (weight + reps)
- Toggle **Reps ↔ Time** per exercise  
  - Cardio defaults to **time-based** logging
- Rest timing aligned to each exercise’s rest settings
- Finish workout → saved into History

### Templates
- Default starter templates included
- Start from template (expands sets automatically)
- Manage templates locally

### History
- View completed workouts
- Workout detail view
- Duplicate past workouts into a new session

### Analytics (Progress)
- Summary stats computed from real workout history (completed sets)
- Weekly training volume trend
- Exercise trend: top set weight over time
- Bodyweight logging + bodyweight trend
- Charts powered by **Recharts**

### Export
- Export workouts/exercises/sets to CSV
- Export bodyweight logs to CSV
- Designed for easy spreadsheet analysis (Google Sheets / Excel)

---

## Tech Stack

### App
- **Vite** + **React** + **TypeScript**
- **TailwindCSS**
- **Recharts** (analytics charts)
- Local persistence (local-first)

### Tools used in the build process
- **Google Stitch (Gemini Stitch)** — initial UI generation / screen concepts
- **Google AI Studio (Gemini 3 Pro)** — early scaffolding + iteration support
- **Cursor** — implementation, refactoring, and feature delivery with agent workflows
- **ChatGPT (GPT-5.2 Thinking)** — architecture, prompting strategy, QA plans, dataset integration approach, and iterative implementation guidance

> This repo reflects an AI-assisted workflow: design → prototype → implementation → refinement, with local-first constraints and tight scope control.

---

## Getting Started

### Requirements
- Node.js 18+ recommended
- npm

### Install + run
```bash
npm install
npm run dev

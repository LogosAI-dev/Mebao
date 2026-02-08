# MeBao

MeBao is a web application that provides an onboarding-driven learning dashboard, AI companion (AI Doll), lessons, and trade-learning/analysis tools.

## Table of Contents
- [Demo / Overview](#demo--overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Install](#install)
	- [Run (development)](#run-development)
	- [Build](#build)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment & Server](#environment--server)
- [Contributing](#contributing)
- [License](#license)

## Demo / Overview

The app guides users through onboarding to capture a learning profile, then unlocks a dashboard with lessons, an AI companion, and trade-learning/analysis pages.

## Features
- Onboarding flow with local profile persistence
- Dashboard with learning progress and analytics
- Lessons list and detail pages
- AI Companion (AI Doll) integration
- Trade-learning and trade-analysis views

## Tech Stack
- React 19
- Vite (using `rolldown-vite` override)
- React Router DOM
- Recharts for visualizations
- Express + Node for optional local service script

## Getting Started

### Prerequisites
- Node.js (16+ recommended)
- npm

### Install

From the project root:

```bash
npm install
```

### Run (development)

Start the Vite dev server:

```bash
npm run dev
```

Open the app in your browser at the address Vite prints (usually `http://localhost:5173`).

### Build

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## Project Structure

- public/ — static assets
- service/ — small Node service scripts (e.g., `gemini.js`)
- src/ — React source files and styles
	- `main.jsx` — app entry
	- `App.jsx` — routes, layout, and onboarding handling
	- `OnboardingPage.jsx`, `MainDashboard.jsx`, `AIDollPage.jsx`, `LessonPage.jsx`, `LessonsDetail.jsx`, `tradelearning.jsx`, `tradeanalysis.jsx`

## Scripts

- `npm run dev` — start development server (Vite)
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run server` — run Node service (`service/gemini.js`)

## Environment & Server

- There is a lightweight Node script under `service/gemini.js`. Start it with:

```bash
npm run server
```

If the project requires API keys or other environment variables, create a `.env` file in the project root and add them there (the project uses `dotenv`).

## Contributing

Feel free to open issues and pull requests. Suggested workflow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and open a PR targeting the `main` branch

## Notes & Next Steps

- The app persists a `mebao_profile` object in `localStorage` during onboarding. Clear `localStorage` to reset the onboarding state.
- Check `vite.config.js` — the project uses a React plugin with a React Compiler Babel plugin enabled.

## License

Add your project license here.

---

If you'd like, I can also:
- add badges (build, license),
- populate a short CONTRIBUTING.md, or
- update `package.json` fields (name, description, author) for publishing.

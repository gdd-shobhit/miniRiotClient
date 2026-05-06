# Rift Launcher — Electron Desktop App

> A Riot Games-inspired game launcher built with **Electron + React + TypeScript**, designed as a structured learning project for myself that maps **desktop app development** concepts directly to **game engine UI engineering and tools creation**.

---

## What is even this thing ...

**Rift Launcher** is a fully frameless desktop application that replicates the visual language and architecture of a real game launcher (like VALORANT and League because i love those games and i am a top player, checkout my youtube shorts - Shoconuts). It is intentionally built in phases to learn how desktop tooling and game engine UI share the same underlying engineering problems
---

## Stack

| Layer | Technology | Game Dev Equivalent |
|---|---|---|
| Shell / Process | **Electron 42** | Game engine main thread |
| Build tooling | **electron-vite + Vite 8** | UnrealBuildTool / CMake |
| UI framework | **React 19** | Slate / UMG widgets |
| Routing | **React Router 7** | Panel / screen manager |
| State | **Zustand 5** | MVVM ViewModel / Blackboard |
| Language | **TypeScript 6** | Strongly-typed Blueprint / C++ |
| Native layer | **C++ node-addon-api** | Engine plugin / native module |

---

## Project Structure Overall 

```
MyElectronApp/
├── src/
│   ├── main/
│   │   └── index.ts          # Electron main process (OS window, IPC handlers)
│   ├── preload/
│   │   └── index.ts          # contextBridge — the only main ↔ renderer bridge
│   └── renderer/src/
│       ├── components/
│       │   ├── TitleBar.tsx  # Custom frameless window title bar + window controls
│       │   ├── Sidebar.tsx   # NavLink-based navigation panel
│       │   ├── GameCard.tsx  # Selectable game list item
│       │   └── StatusBadge.tsx
│       ├── views/
│       │   ├── LibraryView.tsx      # Game list + detail panel (master-detail layout)
│       │   ├── SystemMonitorView.tsx # CPU / memory metrics (C++ addon in Phase 3)
│       │   └── SettingsView.tsx     # Toggle/select settings panel
│       ├── store/
│       │   └── gameStore.ts  # Zustand store — typed state + actions
│       ├── styles/
│       │   └── global.css
│       └── types/index.ts
└── package.json
```

---

## Features (Phase 1 — Current)

- **Frameless window** with a custom-drawn React title bar and working minimize / maximize / close controls wired through IPC
- **Sidebar navigation** using React Router's `NavLink` for automatic active-state styling
- **Library view** — master-detail layout with a scrollable game list and a hero-banner detail panel, driven by a Zustand store
- **Game status system** — `installed`, `update-available`, and `not-installed` states with contextual action buttons
- **Settings view** — toggle and select controls with local React state (persisted to disk in Phase 2)
- **System Monitor view** — metric card grid laid out and ready for live C++ data in Phase 3
- Dark, high-contrast UI styled after modern game launcher design systems

---

## Phased Roadmap

This project is structured so each phase introduces one new concept while relating it back to my MVVM and UI Experience

### Phase 1 — Static UI & Architecture
Establish the full shell: frameless window, routing, component tree, and a Zustand store with mock data. No persistence, no native code — just the UI skeleton working correctly.

### Phase 2 — IPC & Persistence
Replace mock data with real IPC communication between the renderer and main process. Introduce `electron-store` to persist settings to disk. This mirrors how a game UI communicates with engine subsystems via message passing / delegates instead of calling them directly.

### Phase 3 — C++ Native Addon
Write a `system_info.cpp` module using `node-addon-api` that exposes `GlobalMemoryStatusEx` and CPU usage to Node.js as a `.node` binary. Wire it into the System Monitor view for live metrics. This is the Electron equivalent of writing an engine plugin in C++ and exposing it to Blueprint.

---

## The Game Dev Parallel

My background is in game development but it is easily transferable to desktop app development

| Desktop App Concept | Game Engine Equivalent |
|---|---|
| Electron **main process** | Engine **game thread** — owns OS resources, file system, native handles |
| Electron **renderer process** | **UMG / Slate** widget layer — sandboxed UI, no direct engine access |
| **contextBridge / IPC** | **Delegates / Events / RPC** — the controlled channel between UI and engine |
| **Zustand store** | **MVVM ViewModel / Blackboard** — typed, observable state that UI reacts to |
| React **component tree** | **Widget hierarchy** — composable, reusable UI nodes |
| `NavLink` active class | Tracking a **selected tab** in a tab manager widget |
| **C++ node-addon-api** | **Engine C++ plugin** exposed to a higher-level scripting layer |
| `-webkit-app-region: drag` | Custom **hit-test regions** on a borderless game window |
| **electron-store** | Engine **Config / SaveGame** subsystem |
| `BrowserWindow frame: false` | Borderless / frameless game window mode |

The architecture pattern is identical: a sandboxed, high-level UI layer communicates through a well-defined interface to a lower-level process that owns native resources. Electron just makes that boundary explicit with IPC and contextBridge, where a game engine uses delegates and subsystem calls.

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Run in development (opens DevTools automatically)
npm run dev

# Build for production
npm run build
```

---

## Author

**Shobhit Dhamania**

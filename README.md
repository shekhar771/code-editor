# CodeSync

A React + Vite-based code editor UI built around Monaco Editor, sample file management, and authentication scaffolding.

## What is included

- A sidebar with project navigation, file creation, and file deletion
- Monaco Editor integration via `@monaco-editor/react`
- Syntax mode detection based on file extension
- Local sample files displayed in the editor
- Authentication form UI with login/register toggling
- Tailwind CSS styling for a dark editor workspace
- Placeholder collaboration/provider hooks for future real-time sync

## Current status

This project is currently in an early development stage. The main UI is implemented, but backend connectivity and real-time collaboration are not yet complete.

Implemented features:

- User interface for selecting and editing files
- File creation and deletion
- In-app file selection and active editor state
- Monaco editor configuration with theme and layout options
- Auth form layout with login/register mode

Work in progress:

- Real authentication flow (`AuthForm` currently only prevents submission)
- Backend API integration for auth and project persistence
- Collaboration support (`useCollab` is a stub for future Yjs/websocket work)

## Project structure

- `client/`
  - `package.json` — client app dependencies and scripts
  - `src/`
    - `App.tsx` — root application component
    - `components/` — UI components like `AuthForm`, `Editor`, `Sidebar`, and file listing
    - `hooks/` — custom hooks such as `useAuth` and `useCollab`
    - `types/` — shared TypeScript types and sample file data

## Getting started

From the `client` folder:

```bash
cd client
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
cd client
npm run build
```

## Notes

- The app currently uses sample in-memory files via `SAMPLE_FILES`.
- The collaboration hook and auth endpoints are marked for future implementation.
- The app is set up for Tailwind CSS styling, React, and Vite.

## Dependencies

Key dependencies include:

- `react`, `react-dom`
- `vite`
- `@monaco-editor/react`, `monaco-editor`
- `tailwindcss`, `postcss`, `autoprefixer`
- `yjs`, `y-websocket`, `y-monaco` (for planned collaboration features)

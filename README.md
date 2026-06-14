# CodeSync

A React + Vite code editor with Monaco Editor, file management, and authentication UI.

## Features

- Monaco Editor with syntax highlighting and dark theme
- File browser sidebar with create/delete support
- Login/register authentication form
- Sample in-memory files
- Tailwind CSS styling
- Built for real-time collaboration (Yjs/WebSocket integration pending)

## Getting started

```bash
cd client
npm install
npm run dev
```

## Build

```bash
cd client
npm run build
``` 

## Project structure

- `client/src/components/` — UI components (Editor, Sidebar, AuthForm)
- `client/src/hooks/` — useAuth, useCollab hooks
- `client/src/types/` — TypeScript types and sample files

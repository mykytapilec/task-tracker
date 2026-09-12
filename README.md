# Task Tracker

A task management application built with React and TypeScript. The application allows users to create boards, organize tasks into columns, manage task details, and authenticate securely.

The project was built as part of the [Task Tracker project on roadmap.sh](https://roadmap.sh/projects/task-tracker-js).

## Live Demo

Production: https://task-tracker-hvalya.duckdns.org

## Features

* User registration and login
* JWT-based authentication
* Logout functionality
* Board creation and selection
* Task creation and management
* Task details view
* Drag-and-drop task organization
* Responsive interface
* Production deployment with HTTPS

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* dnd-kit
* Node.js
* Express
* PostgreSQL
* Prisma
* JWT
* Nginx
* AWS EC2
* Let's Encrypt

## Project Structure

```text
src/
├── api/
│   ├── auth.ts
│   └── client.ts
├── features/
│   ├── auth/
│   │   ├── components/
│   │   └── store.ts
│   ├── board/
│   │   ├── components/
│   │   ├── constants.ts
│   │   ├── store.ts
│   │   └── types.ts
│   └── tasks/
│       ├── components/
│       ├── constants.ts
│       ├── store.ts
│       └── types.ts
├── layouts/
│   └── MainLayout.tsx
├── App.tsx
├── index.css
└── main.tsx
```

## Getting Started

### Prerequisites

Make sure the following tools are installed:

* Node.js 22 or later
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/mykytapilec/task-tracker.git
cd task-tracker
```

Install dependencies:

```bash
npm ci
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

The backend API is expected to be available at `http://localhost:3000`.

For local development, the Vite development server proxies `/api` requests to the backend.

### Run the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Type Checking

```bash
npm run typecheck
```

Runs the TypeScript compiler without emitting files.

### Linting

```bash
npm run lint
```

Runs ESLint across the project.

### Build

```bash
npm run build
```

Creates an optimized production build.

### Checks

```bash
npm run check
```

Runs type checking and linting.

### Formatting

```bash
npm run format
```

Formats the project using Prettier.

### Preview

```bash
npm run preview
```

Serves the production build locally for preview.

## Authentication

Authentication is handled using JWT tokens.

After a successful login or registration, the token is stored in the browser's local storage and automatically attached to authenticated API requests.

Logging out removes the stored token and resets the authentication state.

## API

The frontend communicates with the backend through REST API endpoints.

The API client automatically:

* Adds the `/api` prefix
* Attaches the JWT authorization header when a token is available
* Handles query parameters
* Parses API responses
* Converts API errors into JavaScript errors

## Production

The production application is served through Nginx.

```text
Browser
   |
   v
HTTPS
   |
   v
Nginx
   |
   +---- / ------> React frontend
   |
   +---- /api ---> Node.js API
                     |
                     v
                 PostgreSQL
```

The production application is available at:

```text
https://task-tracker-hvalya.duckdns.org
```

HTTPS is provided by Let's Encrypt and automatically renewed by Certbot.

## Development Workflow

The project follows a Git flow based on a stable `main` branch and a development branch:

```text
main
  |
  v
dev
  |
  +---- feature/...
  |
  +---- feature/...
  |
  +---- feature/...
```

Feature branches are created from `dev` and merged back into `dev` through pull requests.

## Related Project

Backend repository:

https://github.com/mykytapilec/task-tracker-api

## Roadmap

Project specification:

https://roadmap.sh/projects/task-tracker-js

# 📚OwlReads

A web application that empowers students to track their reading progress while providing teachers with valuable insights to support student development.

> [!CAUTION]
> This project is currently in active development and not yet ready for production use.

## Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [License](#license)

## Features

- User reading progress tracking
- Reading challanges
- Ability to post
- Teacher dashboard with student insights

## Technology stack

- **Backend:** Django, Django REST Framework, Simple JWT
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Tooling:** Poetry (Python deps), npm (frontend deps), Make targets for common tasks
- **Database:** SQLite (default for local development)

### Prerequisites

- Python **3.13** (matching `pyproject.toml`; [pyenv](https://github.com/pyenv/pyenv) is optional)
- [Poetry](https://python-poetry.org/)
- Node.js and npm (for the frontend)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nehakerung/owlreads
cd owlreads
```

2. Install Python dependencies:

```bash
poetry install
```

3. Install frontend dependencies:

```bash
cd frontend && npm install && cd ..
```

### Environment variables

Optional for local runs: Django falls back to safe development defaults. If you add a root `.env` file, start from the template:

```bash
cp .env.example .env
```

Use a unique `SECRET_KEY` if the repo or a deployed instance is visible outside your machine. Set `GOOGLE_BOOKS_API_KEY` if you use `make seed_books` against the live Google Books API.

### Running the application

Use **two terminals** from the repo root: one for the API, one for the Next.js dev server.

**Terminal 1 — Django (default http://127.0.0.1:8000):**

```bash
make runserver
```

**Terminal 2 — Next.js (default http://localhost:3000):**

```bash
make runnextserver
```

Open the frontend URL in a browser. The app expects the API at `http://localhost:8000` (see frontend API client configuration if you change ports).

### Database migrations

After pulling changes or on a fresh clone:

```bash
make migrate
```

Other useful targets: `make seed_books`, `make seed_users`, `make superuser` — see `makefile`.

## License

MIT License

Copyright (c) 2026 Neha Kerung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

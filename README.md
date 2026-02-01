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

## Technology Stack

- **Backend**: Django with Django REST Framework
- **Python Management**: (In works...)
- **Database**: SQLite (development)
- **Python Management**: Pyenv, Poetry

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Python 3.13.7
- [Pyenv](https://github.com/pyenv/pyenv)
- [Poetry](https://python-poetry.org/)

### Installation

1. Clone the repository:

```
git clone https://github.com/nehakerung/owlreads
```

2. Create virtual environment:
```
# create virtual environment for project
python -m venv .venv

# activate the environment
source .venv/bin/activate
```
3. Install dependencies:
```
# install dependencies / no-root is added as sometimes poetyy will try to install it as a package anywats
poetry install --no-root

npm install
```
### Running the Application

Start the development server:
```bash
make runserver
```

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

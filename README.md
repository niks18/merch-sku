# React + Django Application

This repository contains a full-stack application with a Django backend and a React frontend.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** and **npm**
- **pip** (Python package manager)
- **virtualenv** (recommended for Python dependencies)

---

## Backend (Django) Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

5. **(Optional) Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the backend server:**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000).

---

## Frontend (React) Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## CORS Configuration

The Django backend is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`

If you use a different port for the frontend, update `CORS_ALLOWED_ORIGINS` in `backend/merch_dashboard/settings.py`.

---

## Database

- The default database is SQLite (`db.sqlite3`).
- No setup is required for development; migrations will create the database file.

---

## Environment Variables

- For production, set `DEBUG = False` and configure `ALLOWED_HOSTS` in `backend/merch_dashboard/settings.py`.
- Set a secure `SECRET_KEY` for production.

---

## Common Issues

- If you get `ModuleNotFoundError` for Django packages, ensure your virtual environment is activated.
- If ports are in use, change them with `python manage.py runserver 0.0.0.0:8001` or `npm start -- --port 3001`.

---

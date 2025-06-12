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


## API Routes and Expected Inputs/Outputs

### SKU Management

- **List SKUs**
  - **GET** `/api/skus/`
  - **Response:** List of SKUs with fields: `uuid`, `name`, `sales`, `return_percentage`, `content_score`, `created_at`, `updated_at`.

- **Create SKU**
  - **POST** `/api/skus/`
  - **Input:** `{ "name": "Product Name" }`
  - **Response:** Created SKU object.

- **Retrieve SKU**
  - **GET** `/api/skus/{uuid}/`
  - **Response:** SKU details including notes.

- **Update SKU**
  - **PUT/PATCH** `/api/skus/{uuid}/`
  - **Input:** `{ "name": "Updated Name", "sales": 10, ... }`
  - **Response:** Updated SKU object.

- **Delete SKU**
  - **DELETE** `/api/skus/{uuid}/`
  - **Response:** 204 No Content.

### Notes

- **List Notes**
  - **GET** `/api/notes/`
  - **Query Params:** `?sku={uuid}` (optional)
  - **Response:** List of notes with fields: `id`, `sku`, `content`, `created_at`, `updated_at`.

- **Create Note**
  - **POST** `/api/notes/`
  - **Input:** `{ "sku": "uuid", "content": "Note text" }`
  - **Response:** Created note object.

### Sales Activities

- **List Sales Activities**
  - **GET** `/api/sales-activities/`
  - **Query Params:** `?sku={uuid}` (optional)
  - **Response:** List of sales activities with fields: `id`, `sku`, `quantity`, `date`, `created_at`.

- **Create Sales Activity**
  - **POST** `/api/sales-activities/`
  - **Input:** `{ "sku": "uuid", "quantity": 5, "date": "2023-01-01" }`
  - **Response:** Created sales activity object.

### Return Activities

- **List Return Activities**
  - **GET** `/api/return-activities/`
  - **Query Params:** `?sku={uuid}` (optional)
  - **Response:** List of return activities with fields: `id`, `sku`, `quantity`, `date`, `created_at`.

- **Create Return Activity**
  - **POST** `/api/return-activities/`
  - **Input:** `{ "sku": "uuid", "quantity": 2, "date": "2023-01-01" }`
  - **Response:** Created return activity object.

### Content Score Activities

- **List Content Score Activities**
  - **GET** `/api/content-score-activities/`
  - **Query Params:** `?sku={uuid}` (optional)
  - **Response:** List of content score activities with fields: `id`, `sku`, `score`, `date`, `created_at`.

- **Create Content Score Activity**
  - **POST** `/api/content-score-activities/`
  - **Input:** `{ "sku": "uuid", "score": 8, "date": "2023-01-01" }`
  - **Response:** Created content score activity object.

---

## Assumptions

- The application uses SQLite as the default database for development.
- CORS is configured to allow requests from `http://localhost:3000` and `http://localhost:5173`.
- The frontend uses Axios for API calls and expects the API base URL to be set in the environment variable `VITE_API_BASE_URL`.
- The backend calculates `content_score` and `return_percentage` automatically based on activities.

---

## Future Improvements

- **Authentication:** Implement JWT or session-based authentication for secure API access.
- **Pagination:** Add pagination to API responses for better performance with large datasets.
- **Testing:** Expand test coverage for both frontend and backend.
- **Error Handling:** Improve error messages and validation feedback.
- **UI Enhancements:** Add more interactive features, such as filtering and sorting in the frontend.
- **Deployment:** Set up CI/CD pipelines and deploy to a production environment (e.g., Heroku, AWS).

---

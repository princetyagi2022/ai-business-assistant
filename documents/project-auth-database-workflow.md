# AI Business Assistant: Project, Auth, Database, and Run Workflow

## What Was Completed

The project now has real database-backed account creation and password login through the Spring Boot backend.

- New accounts are saved in the MySQL `users` table.
- Passwords are hashed with BCrypt before storage.
- Login accepts email or username plus password.
- Successful login returns a JWT token.
- Protected API calls use `Authorization: Bearer <token>`.
- `/api/auth/me` returns the authenticated user from the token.
- Default roles are created automatically on backend startup.

## Main Project Structure

```text
ai-business-assistant/
  backend/      Spring Boot REST API, security, entities, repositories, database access
  frontend/     React + Vite web app, pages, layouts, auth context, API services
  ml-models/    FastAPI ML service and dataset processors
  documents/    Project documentation and workflow notes
  docker/       Docker-related project assets
```

## Important Backend Files

- `backend/pom.xml`: Java dependencies and build settings.
- `backend/src/main/resources/application.yml`: MySQL, JPA, JWT, server, ML API, and logging configuration.
- `backend/src/main/resources/schema.sql`: Full MySQL schema for roles, users, products, customers, orders, analytics records, documents, chat history, logs, and related business data.
- `backend/src/main/java/com/ai/assistant/AiBusinessAssistantApplication.java`: Spring Boot app entry point.
- `backend/src/main/java/com/ai/assistant/config/SecurityConfig.java`: Stateless JWT security, CORS, password encoder, and auth manager configuration.
- `backend/src/main/java/com/ai/assistant/config/DataInitializer.java`: Creates default roles in the database.
- `backend/src/main/java/com/ai/assistant/controller/AuthController.java`: Login, register, current-user, and auth workflow endpoints.
- `backend/src/main/java/com/ai/assistant/service/AuthService.java`: Main authentication business logic.
- `backend/src/main/java/com/ai/assistant/security/JwtUtil.java`: JWT creation and validation.
- `backend/src/main/java/com/ai/assistant/security/JwtAuthenticationFilter.java`: Reads Bearer tokens and authenticates requests.
- `backend/src/main/java/com/ai/assistant/security/CustomUserDetailsService.java`: Loads users from the database for Spring Security.
- `backend/src/main/java/com/ai/assistant/entity/User.java`: User database entity.
- `backend/src/main/java/com/ai/assistant/entity/Role.java`: Role database entity.
- `backend/src/main/java/com/ai/assistant/repository/UserRepository.java`: User database queries.
- `backend/src/main/java/com/ai/assistant/repository/RoleRepository.java`: Role database queries.
- `backend/src/main/java/com/ai/assistant/dto/*.java`: Request and response DTOs used by API endpoints.

## Important Frontend Files

- `frontend/package.json`: Frontend dependencies and scripts.
- `frontend/vite.config.js`: Vite dev server and build configuration.
- `frontend/src/main.jsx`: React entry point.
- `frontend/src/App.jsx`: Top-level app rendering.
- `frontend/src/routes/index.jsx`: Route wiring.
- `frontend/src/routes/ProtectedRoute.jsx`: Blocks private pages unless logged in.
- `frontend/src/routes/PublicRoute.jsx`: Public-only auth route handling.
- `frontend/src/context/AuthContext.jsx`: Stores auth state, login/register/logout functions, and current user.
- `frontend/src/services/api.js`: Axios instance with JWT request interceptor.
- `frontend/src/services/authService.js`: Login, register, current-user, and auth API calls.
- `frontend/src/pages/auth/LoginPage.jsx`: Login form.
- `frontend/src/pages/auth/RegisterPage.jsx`: Create account form.
- `frontend/src/utils/storage.js`: Local storage helpers for token and user.
- `frontend/src/utils/constants.js`: API paths, roles, app names, and storage keys.
- `frontend/src/utils/validators.js`: Form validation schemas.

## Important ML Service Files

- `ml-models/main.py`: FastAPI app entry point.
- `ml-models/requirements.txt`: Python dependencies.
- `ml-models/api/routes/dataset_routes.py`: Dataset API routes.
- `ml-models/ml_modules/`: Analytics, sales, customer, inventory, finance, marketing, and fraud modules.
- `ml-models/data/*.csv`: Local sample datasets used by ML modules.

## Authentication Workflow

```text
Create account
  React RegisterPage
  -> authService.register()
  -> POST /api/auth/register
  -> AuthController
  -> AuthService
  -> BCrypt hashes password
  -> JPA saves user in MySQL users table
  -> React redirects to login

Login
  React LoginPage
  -> authService.login()
  -> POST /api/auth/login
  -> Spring AuthenticationManager verifies BCrypt password
  -> JwtUtil creates JWT
  -> React stores token and user

Protected request
  React API service adds Authorization header
  -> JwtAuthenticationFilter validates token
  -> Spring Security sets authenticated user
  -> Controller returns protected data
```

## Why Each Technology Is Used

- Java 21: Modern, stable backend language for enterprise APIs.
- Spring Boot: Fast REST API development with dependency injection and production-ready defaults.
- Spring Security: Password authentication, route protection, and security filters.
- Spring Data JPA: Database persistence through repositories instead of manual SQL everywhere.
- Hibernate: Maps Java entities to MySQL tables.
- MySQL: Stores users, roles, customers, products, orders, documents, chat logs, analytics, and business records.
- BCrypt: Secure one-way password hashing.
- JWT: Stateless real-time authentication for frontend API requests.
- React: Component-based frontend UI.
- Vite: Fast frontend dev server and build tool.
- Axios: HTTP client with centralized token handling.
- Material UI: Ready-made polished UI components.
- React Hook Form and Yup: Form state and validation.
- FastAPI: Lightweight Python service for ML analytics APIs.
- Pandas and scikit-learn style modules: Dataset processing and ML-driven analytics.

## Terminal Commands To Run The Project

Run MySQL first and make sure these credentials match `backend/src/main/resources/application.yml`.

```powershell
mysql -u root -p
CREATE DATABASE IF NOT EXISTS ai_business_assistant;
exit
```

Run backend:

```powershell
cd D:\Projects\ai-business-assistant\backend
mvn spring-boot:run
```

Run frontend:

```powershell
cd D:\Projects\ai-business-assistant\frontend
npm install
npm run dev
```

Run ML API:

```powershell
cd D:\Projects\ai-business-assistant\ml-models
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 5000
```

Open the frontend:

```text
http://localhost:5173
```

Backend API base URL:

```text
http://localhost:8080/api
```

ML API base URL:

```text
http://localhost:5000
```

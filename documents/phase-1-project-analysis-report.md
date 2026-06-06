# Phase 1 Project Analysis Report

Generated: 2026-06-06

## Current Structure

The project is split into three main application areas:

- `frontend`: React 19 + Vite + MUI + Recharts UI.
- `backend`: Java 21 + Spring Boot 3.5 + Spring Security + Spring Data JPA + MySQL.
- `ml-models`: FastAPI + pandas + scikit-learn data processors and CSV datasets.

## Frontend Pages

Implemented page files:

- Auth: login, register, forgot password, reset password, verify email.
- Main: dashboard, AI agents, chatbot, notifications, settings.
- Users: list, create, details, edit, profile.
- Products: list.
- Customers: list.
- Analytics: real ML dataset/analysis page added in this phase.
- Error pages: 403, 404, 500.
- Placeholder routes still active for employees, inventory, sales, orders, finance, marketing, reports, and documents.

## Frontend Services

Existing service files:

- `api.js`: shared Axios client for Spring backend.
- `authService.js`
- `dashboardService.js`
- `userService.js`
- `employeeService.js`
- `customerService.js`
- `productService.js`
- `inventoryService.js`
- `salesService.js`
- `financeService.js`
- `marketingService.js`
- `analyticsService.js`
- `reportService.js`
- `documentService.js`
- `notificationService.js`
- `chatbotService.js`
- `mlAnalyticsService.js` added in this phase for FastAPI dataset analytics.

Issues found:

- `dashboardService.js` uses a hardcoded Axios URL instead of the shared API client.
- Several service files point to endpoints that do not currently exist in the Spring backend.
- Retry handling is not implemented consistently.
- Loading/error states exist in some pages but not uniformly across modules.

## Dummy Data Usage

The frontend still contains `frontend/src/utils/mockDashboard.js` with mock dashboard stats, charts, users, products, customers, and agents.

Current mock consumers:

- `pages/users/UserList.jsx`
- `pages/users/UserDetails.jsx`
- `pages/users/EditUser.jsx`
- `pages/products/ProductList.jsx`
- `pages/customers/CustomerList.jsx`
- `pages/ai-agents/AgentsDashboard.jsx`

Other dummy/fallback behavior:

- `ChatbotPage.jsx` returns a demo response when backend chatbot calls fail.
- `TopNavbar.jsx` search input has an empty handler.
- Multiple modules are placeholders rather than functional screens.

## Backend APIs

No Spring REST controllers are implemented in `backend/src/main/java/com/ai/assistant/controller`.

No Spring service classes are implemented in `backend/src/main/java/com/ai/assistant/service`.

Because controllers and services are empty, the frontend API services cannot currently receive real Spring backend data for users, dashboard, products, customers, orders, inventory, sales, finance, chatbot, agents, reports, documents, or notifications.

## Backend Entities

Existing JPA entities:

- `AgentLog`
- `Category`
- `ChatHistory`
- `Customer`
- `Document`
- `Employee`
- `EmployeeTask`
- `FraudAlert`
- `Inventory`
- `MarketingCampaign`
- `Notification`
- `Order`
- `OrderItem`
- `Product`
- `Report`
- `Role`
- `Sale`
- `Supplier`
- `SupportTicket`
- `User`

Missing from requested final schema:

- `Invoice`
- `AiPrediction`
- Separate uploaded document/vector metadata model for RAG beyond current `Document`.
- Refresh token/session model.

## Backend DTOs

Existing DTOs:

- `ApiResponse`
- `CategoryDto`
- `ChatRequest`
- `ChatResponse`
- `CustomerDto`
- `DashboardStats`
- `DocumentDto`
- `EmployeeDto`
- `FraudAlertDto`
- `InventoryDto`
- `JwtResponse`
- `LoginRequest`
- `NotificationDto`
- `OrderDto`
- `OrderItemDto`
- `ProductDto`
- `RegisterRequest`
- `SupplierDto`
- `SupportTicketDto`
- `UserDto`

DTO coverage is broad, but there is no mapper/service/controller layer using them.

## Backend Repositories

Existing Spring Data repositories:

- `AgentLogRepository`
- `CategoryRepository`
- `ChatHistoryRepository`
- `CustomerRepository`
- `DocumentRepository`
- `EmployeeRepository`
- `EmployeeTaskRepository`
- `FraudAlertRepository`
- `InventoryRepository`
- `MarketingCampaignRepository`
- `NotificationRepository`
- `OrderItemRepository`
- `OrderRepository`
- `ProductRepository`
- `ReportRepository`
- `RoleRepository`
- `SaleRepository`
- `SupplierRepository`
- `SupportTicketRepository`
- `UserRepository`

Repositories exist for all current entities, but controller/service logic is missing.

## Security Configuration

Existing security files:

- `SecurityConfig.java`
- `JwtUtil.java`
- `JwtAuthenticationFilter.java`
- `CustomUserDetails.java`
- `CustomUserDetailsService.java`

Issues found:

- `application.yml` contains a hardcoded MySQL password.
- `jwt.secret` is hardcoded and should be moved to environment/secrets management.
- No refresh token implementation exists.
- No logout/token revocation implementation exists.
- No auth controller exists, so login/register APIs are not exposed despite frontend services expecting them.
- Role set currently includes `ADMIN`, `MANAGER`, and `EMPLOYEE`; requested `CUSTOMER` role is missing from schema seed.

## Database

Existing schema file: `backend/src/main/resources/schema.sql`.

Current schema includes:

- roles, users, categories, products, suppliers, inventory, customers, orders, order_items, sales, employees, support_tickets, marketing_campaigns, fraud_alerts, reports, notifications, documents, chat_history, agent_logs, employee_tasks.

Issues found:

- `schema.sql` is manually maintained while JPA is set to `ddl-auto: update`; this can drift.
- Missing requested tables: `invoices`, `ai_predictions`, `uploaded_documents`.
- No Flyway/Liquibase migration system.
- Default admin password hash comment is suspicious and should be verified.
- Production credentials and local credentials are mixed in config files.

## ML Models And Datasets

Datasets in `ml-models/data`:

- `analytics_mixed.csv`
- `attendance.csv`
- `customers.csv`
- `employees.csv`
- `finance.csv`
- `fraud_transactions.csv`
- `inventory.csv`
- `marketing.csv`
- `products.csv`
- `sales.csv`
- `users.csv`

Existing ML processors:

- Sales forecast: linear regression.
- Sales revenue analytics.
- Finance profit analysis.
- Finance expense forecast: linear regression.
- Inventory low stock alerts.
- Inventory reorder suggestions.
- Customer segmentation: KMeans.
- Customer churn scoring with optional RandomForest.
- Marketing campaign analytics.
- Fraud detection: IsolationForest.
- Analytics KPI dashboard.

Issues found:

- Models generally run in-memory and are not saved with joblib.
- No train/validation/test lifecycle exists yet for production models.
- No metric output for accuracy, precision, recall, F1, or ROC AUC.
- Requested Random Forest/XGBoost sales forecasting is not implemented.
- XGBoost is not listed in `requirements.txt`.
- FastAPI originally only accepted posted rows; this phase added CSV-backed catalog/dataset/sample-operation endpoints.

## FastAPI ML Service

Existing:

- `GET /api/health`
- `POST /api/datasets/{module}/{operation}`
- Added in this phase:
  - `GET /api/datasets/catalog`
  - `GET /api/datasets/{module}`
  - `GET /api/datasets/{module}/{operation}/sample`

Requested but not yet implemented:

- `GET /health` without `/api`.
- `GET /dashboard`
- `POST /sales-prediction`
- `POST /inventory-prediction`
- `POST /customer-churn`
- `POST /fraud-detection`
- `POST /analytics`
- `POST /chat`

## Chatbot Implementation

Current frontend chatbot calls `/chatbot/chat`, `/chatbot/history`, and `/chatbot/history` delete through `chatbotService`.

Backend chatbot implementation is missing:

- No controller.
- No service.
- No agent dispatch.
- No database query integration.
- No ML integration.
- No RAG integration.

Current UI falls back to a demo response on failure, so it still behaves like a prototype.

## AI Agent Implementation

Current frontend AI agents page renders mock agents from `mockDashboard.js`.

Backend `agent` package is empty.

Missing:

- Coordinator Agent.
- Sales Agent.
- Inventory Agent.
- Finance Agent.
- Marketing Agent.
- Analytics Agent.
- Customer Support Agent.
- Agent orchestration, persistence, and tool/data access.

## RAG Implementation

Backend `rag` package is empty.

Current `Document` entity exists, but no document upload controller/service, parser, chunker, embedding pipeline, vector storage, or semantic search implementation exists.

LangChain4j, Ollama integration, and ChromaDB integration are not implemented in code.

## Build Verification

Frontend:

- `npm run build` succeeds.
- Warning: final JS chunk is large at about 1.17 MB; code splitting should be added later.

Backend:

- `mvn test -DskipTests` succeeds after allowing Maven to write the local `.m2` cache.
- Java source compiles.
- Tests are skipped and no backend test coverage was found.

ML:

- Direct route checks succeeded for catalog, dataset split, and marketing analysis.
- FastAPI service health check succeeded on `127.0.0.1:8000/api/health` during verification.

## Highest Priority Gaps

1. Implement Spring authentication controller/service first because protected frontend routes depend on login/register/me.
2. Implement real dashboard API because dashboard is the default route and currently expects nonexistent backend data.
3. Replace mock users/products/customers/agents pages with real service-backed pages.
4. Add backend CRUD controllers/services for current entities before adding new modules.
5. Introduce migrations and remove hardcoded credentials/secrets.
6. Convert ML processors into train/test/save/evaluate workflows.
7. Implement chatbot and multi-agent backend after core data APIs are stable.
8. Implement RAG only after document CRUD/upload is working.

## Phase 1 Progress

Completed:

- Analyzed frontend page structure.
- Analyzed frontend service layer.
- Identified mock/dummy data usage.
- Analyzed backend entities, DTOs, repositories, security, and schema.
- Confirmed backend controller/service/agent/rag packages are empty.
- Analyzed ML datasets and processors.
- Verified frontend and backend builds.
- Added initial real ML dataset analytics handoff for the frontend analytics page.

Next recommended step:

- Start Phase 2 with the authentication/dashboard foundation, then remove mock data module by module only when matching backend APIs exist.

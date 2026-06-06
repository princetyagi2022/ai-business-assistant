# AI-Powered Multi-Agent Business Assistant

## Overview

AI-Powered Multi-Agent Business Assistant is a full-stack enterprise application that combines Artificial Intelligence, Machine Learning, Multi-Agent Systems, and Business Analytics into a single platform.

The system helps organizations automate business operations, predict future trends, optimize inventory, analyze sales, provide AI-powered customer support, and generate intelligent business insights.

---

## Features

### Authentication & Security

- JWT Authentication
- Role-Based Access Control
- Spring Security
- Secure REST APIs

### Business Management

- User Management
- Employee Management
- Customer Management
- Product Management
- Inventory Management
- Sales Management
- Order Management

### AI & Machine Learning

- Multi-Agent AI System
- Sales Forecasting
- Inventory Prediction
- Customer Churn Analysis
- Fraud Detection
- Business Analytics

### AI Chatbot

- Natural Language Queries
- Business Data Analysis
- AI Recommendations
- Customer Support

### RAG (Retrieval-Augmented Generation)

- PDF Upload
- DOCX Upload
- Excel Upload
- Semantic Search
- AI Document Question Answering

### Dashboard Analytics

- Revenue Analysis
- Sales Trends
- Customer Growth
- Inventory Alerts
- AI Insights

---

## System Architecture

```text
React Frontend
       │
       ▼
Spring Boot Backend
       │
       ▼
MySQL Database
       │
       ▼
Multi-Agent AI Layer
       │
       ▼
FastAPI ML Services
       │
       ▼
Machine Learning Models
```

---

## Technology Stack

### Frontend

- React.js
- Material UI
- JavaScript
- Axios
- React Router

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-Learn
- XGBoost
- Random Forest
- Isolation Forest

### AI

- LangChain4j
- Ollama
- ChromaDB
- RAG
- Multi-Agent AI

### DevOps

- Git
- GitHub
- Docker
- Postman

---

## Project Structure

```text
ai-business-assistant
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── application.properties
│
├── ml-models
│   ├── datasets
│   ├── models
│   ├── training
│   └── main.py
│
├── docs
│
├── README.md
└── .gitignore
```

---

## Database Modules

- Users
- Roles
- Employees
- Customers
- Products
- Suppliers
- Inventory
- Orders
- Sales
- Notifications
- AI Predictions
- Chat History

---

## AI Agents

### Coordinator Agent

Routes requests to the correct agent.

### Sales Agent

Predicts future sales.

### Inventory Agent

Recommends stock replenishment.

### Finance Agent

Analyzes revenue and expenses.

### Marketing Agent

Provides marketing insights.

### Analytics Agent

Generates business intelligence reports.

### Customer Support Agent

Handles customer queries.

---

## Machine Learning Models

| Module | Algorithm |
|----------|----------|
| Sales Forecasting | Random Forest |
| Inventory Prediction | Random Forest |
| Customer Churn | Logistic Regression |
| Fraud Detection | Isolation Forest |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-business-assistant.git
```

---

### Backend Setup

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

### ML Service Setup

```bash
cd ml-models

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload --port 5000
```

ML URL:

```text
http://localhost:5000
```

---

## Future Enhancements

- Kubernetes Deployment
- Docker Compose
- Real-Time Notifications
- WhatsApp Integration
- Voice Assistant
- AI Workflow Automation
- Predictive Business Intelligence

---

## Resume Highlights

- Built a Full Stack Enterprise Application
- Implemented Multi-Agent AI Architecture
- Integrated Machine Learning Models
- Developed RAG-Based Document Assistant
- Implemented JWT Security
- Created Business Analytics Dashboard
- Integrated FastAPI and Spring Boot

---

## Author

Prince Tyagi

MCA Student | Java Developer | Spring Boot Developer | AI & Machine Learning Enthusiast

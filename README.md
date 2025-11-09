# DEA Enterprise Platform

A full-stack web application for freelance job management and collaboration, built with Spring Boot and React.

## 🏗️ Project Overview

This platform enables clients to post jobs, freelancers to apply for opportunities, and facilitates file submissions and project management. The application features role-based access control, real-time dashboards, and comprehensive job application workflows.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 21
- **Database**: MySQL 8
- **Security**: Spring Security + JWT Authentication
- **ORM**: Spring Data JPA (Hibernate)
- **API Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.1.12
- **Routing**: React Router DOM 6.8.0
- **HTTP Client**: Axios 1.3.0
- **UI Styling**: Tailwind CSS 3.3.0
- **Animations**: Framer Motion 10.0.0
- **State Management**: React Query 3.39.0
- **Forms**: React Hook Form 7.43.0
- **Notifications**: React Hot Toast 2.4.1
- **Icons**: Lucide React 0.263.0

## ✨ Features

### User Management
- User registration and authentication (JWT-based)
- Role-based access control (Admin, Client, Creative)
- Profile management with avatar upload
- Social media links integration

### Job Management
- Post and manage job listings
- Job search and filtering
- Job status tracking (Open, In Progress, Completed, Cancelled)
- Job type categorization (Full-time, Part-time, Contract, Freelance)
- Experience level filtering (Entry, Intermediate, Expert)

### Application System
- Apply for jobs with custom messages
- Track application status (Pending, Reviewed, Accepted, Rejected)
- View application history
- Client-side application management

### File Submission
- Upload work submissions for jobs
- Track submission status (Pending, Under Review, Approved, Rejected, Revision Requested)
- File storage and retrieval
- Submission history tracking

### Analytics Dashboard
- Admin dashboard with system-wide analytics
- Client dashboard for managing posted jobs
- Creative dashboard for tracking applications
- Real-time statistics and metrics

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18 or higher
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6+ (or use included Maven wrapper)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DEA-project
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE Freelance_db;
```

**Note**: The application will automatically create tables on first run using Hibernate auto-DDL.

### 3. Backend Setup

Navigate to the Backend directory:

```bash
cd Backend
```

Install dependencies (Maven will automatically download them):

```bash
./mvnw clean install
```

### 4. Frontend Setup

Navigate to the Frontend directory:

```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `Backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/Freelance_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Configuration
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
app.upload.dir=uploads

# CORS Configuration
cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:8080/api`.

If you need to change the API URL, update `Frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🏃 Running the Application

### Start the Backend

From the `Backend` directory:

```bash
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

### Start the Frontend

From the `Frontend` directory:

```bash
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/api-docs

## 📚 API Documentation

The backend provides interactive API documentation through Swagger UI:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/api-docs

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/avatar` - Upload profile avatar

#### Job Management
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job (Client only)
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job (Client only)
- `DELETE /api/jobs/{id}` - Delete job (Client only)

#### Job Applications
- `POST /api/applications` - Apply for a job
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/job/{jobId}` - Get applications for a job
- `PUT /api/applications/{id}/status` - Update application status

#### File Submissions
- `POST /api/submissions` - Submit work for a job
- `GET /api/submissions/job/{jobId}` - Get submissions for a job
- `PUT /api/submissions/{id}/status` - Update submission status

## 📁 Project Structure

```
DEA-project1/
├── Backend/
│   ├── src/main/java/com/enterprise/backend/
│   │   ├── config/           # Security and CORS configuration
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # JWT and authentication
│   │   ├── service/          # Business logic layer
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── Frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── applications/ # Job application components
│   │   │   ├── auth/         # Login/Register components
│   │   │   ├── common/       # Shared components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── jobs/         # Job-related components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── profile/      # Profile components
│   │   │   └── submissions/  # File submission components
│   │   ├── contexts/         # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── styles/           # Global styles
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 💡 Usage

### Default Users

The application initializes with default users (configured in `DataInitializer.java`):

1. **Client User**
   - Email: You Can Use Any E-mail
   - Password: You Can Use Any Password
   - Role: CLIENT

2. **Freelancer**
   - Email: You Can Use Any E-mail
   - Password: You Can Use Any Password
   - Role: Freelancer

### User Workflows

#### As a Client
1. Register/Login as a client
2. Post new job listings
3. Manage your posted jobs
4. Review applications from creatives
5. Accept/reject applications
6. Review submitted work

#### As a Freelancer
1. Register/Login as a freelancer
2. Browse available jobs
3. Filter jobs by type and experience level
4. Apply for jobs
5. Track application status
6. Submit completed work


### Building for Production

#### Backend
```bash
cd Backend
./mvnw clean package
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd Frontend
npm run build
```

The production build will be created in the `Frontend/dist` directory.

## 🔒 Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention through JPA
- File upload validation and size limits

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure the database `Freelance_db` exists

**Port Already in Use**
- Change the port in `application.properties`: `server.port=8081`

### Frontend Issues

**Cannot Connect to Backend**
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API URL in `api.js`

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## 📄 License

This project is licensed under the MIT License.



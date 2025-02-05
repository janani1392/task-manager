Task Manager Application
This project is a task management application built with Angular for the frontend and Node.js with MongoDB for the backend. It is fully containerized using Docker and orchestrated with Docker Compose.

Features
User authentication with JWT (JSON Web Tokens).
Perform CRUD operations (Create, Read, Update, Delete) for tasks.
RESTful API endpoints for task management.
Responsive UI built with Angular.
Fully Dockerized for seamless deployment.
Technologies Used
Frontend: Angular, Nginx
Backend: Node.js, Express.js
Database: MongoDB (Cloud MongoDB Cluster)
Deployment: Docker, Docker Compose
Prerequisites
Make sure you have the following installed on your system:

Git
Docker
Docker Compose (Included with Docker Desktop)
Setup Instructions
To run this project locally:

Clone the repository:
git clone https://github.com/janani1392/task-manager-app.git

Navigate to the project directory:
cd task-manager-app

Run the application with Docker Compose:
docker-compose up --build

Access the application:
Frontend: http://localhost:4200
Backend API: http://localhost:5000

To stop the application:
docker-compose down

Folder Structure:

task-manager-app/
│
├── task-manager-frontend/   # Frontend (Angular + Nginx)
│   ├── Dockerfile
│   └── ...
│
├── task-manager-backend/    # Backend (Node.js + Express)
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml       # Orchestrates frontend and backend
└── README.md                # Project documentation

Docker Overview
The application consists of two services:

Frontend
Built using Angular.
Deployed with Nginx.
Accessible on http://localhost:4200.
Backend
Built using Node.js and Express.
Exposes RESTful API endpoints for task management.
Accessible on http://localhost:5000.
The docker-compose.yml file manages both services:

Builds Docker images for frontend and backend.
Maps ports for local access (4200 for frontend and 5000 for backend).
Future Enhancements
Add unit tests and integration tests.
Deploy to AWS or Azure for cloud hosting.
Improve security measures for production.
Contributing
Contributions are welcome! Feel free to submit a pull request or create an issue in the repository.

License
This project is licensed under the MIT License.

Author
Janani Gunasekaran
GitHub: janani1392
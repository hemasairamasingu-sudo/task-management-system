# Task Management Web Application

A full-stack Task Management Web Application that allows users to securely register, log in, and manage their tasks.

Users can create, view, update, delete, search, and filter tasks through a responsive web interface.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- User-specific task access
- Secure logout

### 📝 Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Set task status
- Set task priority
- Set due dates
- Search tasks
- Filter tasks by status
- Track task progress

### 📊 Dashboard

- Total tasks
- Pending tasks
- In-progress tasks
- Completed tasks
- Task overview
- User-friendly dashboard

### 📱 Responsive Design

The application is designed to work on:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

---

## 🏗️ Project Architecture

```text
                    Task Management Application
                              │
             ┌────────────────┴────────────────┐
             │                                 │
         Frontend                           Backend
         React.js                         Node.js
             │                              Express.js
             │                                 │
             │                              REST API
             │                                 │
             └──────────────┬──────────────────┘
                            │
                         MongoDB
                            │
                    ┌───────┴───────┐
                    │               │
                  Users            Tasks
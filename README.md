# 🚀 Social App

> **A modern social networking platform where users can share posts, interact through likes, comments and replies, follow other users, and receive notifications. Built to simulate real-world social media architecture.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://social-aobwiil4p-alaa-harb7s-projects.vercel.app/)    [![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=for-the-badge)](https://main-portfolio-lilac-eta.vercel.app/) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/alaa-harb7)

---

## 📌 Overview

Social App is a full-featured social networking application inspired by modern platforms like Facebook and Twitter.  
It allows users to create posts, interact with content through likes, comments, and replies, follow other users, and discover new people.

The project focuses on building a scalable and maintainable frontend architecture using React and modern tools like React Query for efficient server-state management.

Unlike simple tutorial projects, this application implements real-world social features such as nested comments, notifications, user discovery, and profile customization.

---

## 🎬 Demo

> 🌐 [Try the live app](https://social-aobwiil4p-alaa-harb7s-projects.vercel.app/)

<!-- Optional -->
<!-- ![App Screenshot](./screenshots/feed.png) -->

---

## ✨ Features

- ✅ **Authentication System** — Secure login using JWT authentication.
- ✅ **Create & Share Posts** — Users can publish posts with text and images.
- ✅ **Like System** — React to posts instantly with optimized UI updates.
- ✅ **Comments & Replies** — Full threaded comment system with nested replies.
- ✅ **User Profiles** — Each user has a customizable profile with photo and cover image.
- ✅ **Follow System** — Follow or unfollow other users.
- ✅ **Discover Users** — Suggests people you may know.
- ✅ **Notifications System** — Users receive notifications when someone interacts with their content.
- 🔜 **Upcoming: Real-time Notifications** — WebSocket-based live notifications.

---

## 🏗️ Architecture & Technical Decisions

> This section explains the reasoning behind the technical decisions in the project.

### System Design Overview

The application follows a **client-server architecture**, where the frontend is built as a React Single Page Application (SPA) that communicates with a RESTful backend API.

React Query manages server state, providing caching, background updates, and optimized API calls.

The UI is structured using reusable components, allowing scalability and maintainability as the project grows.

---

### Key Technical Decisions

**Why React?**

React's component-based architecture allows building reusable UI components and managing complex interfaces efficiently.

---

**Why React Query?**

React Query was chosen for handling server-state management because it provides:

- API caching
- background refetching
- optimistic updates
- simplified loading and error states

This significantly reduces boilerplate compared to traditional state management solutions.

---

**Authentication Approach**

Authentication is handled using **JWT tokens** stored in local storage and attached to API requests using Axios headers.

Protected routes ensure that only authenticated users can access private pages.

---

**Component Architecture**

The UI is divided into reusable components such as:

- PostCard
- Comment
- NotificationItem
- SuggestedUserCard
- ProfileCover

This improves scalability and reduces duplicated code across the application.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React.js | Component-based architecture |
| Styling | Tailwind CSS | Utility-first styling for rapid UI development |
| UI Components | HeroUI | Accessible and modern UI components |
| State Management | React Query | Efficient server-state caching |
| Routing | React Router | SPA navigation |
| HTTP Client | Axios | API communication |
| Icons | React Icons | Consistent icon system |
| Deployment | Vercel | Fast and simple deployment |

---

## 🚧 Challenges & How I Solved Them

### Challenge 1: Nested Comment Replies

**Problem:**  
Implementing a threaded comment system where replies belong to a parent comment required managing nested data structures.

**Solution:**  
I implemented recursive rendering of the Comment component so that replies are rendered using the same component.

**Result:**  
The application now supports unlimited nested replies while maintaining clean and reusable UI code.

---

### Challenge 2: Optimistic UI Updates

**Problem:**  
Waiting for API responses before updating UI interactions (like likes or follows) caused delays in user experience.

**Solution:**  
Implemented **React Query optimistic updates using `onMutate`**.

**Result:**  
User interactions now feel instant while still keeping data synchronized with the backend.

---

### Challenge 3: Component Reusability

**Problem:**  
Several UI patterns like post cards and user cards were repeated across different pages.

**Solution:**  
Refactored them into reusable components with configurable props.

**Result:**  
Reduced duplicated code and improved maintainability.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/login` | Authenticate user |
| GET | `/posts` | Retrieve feed posts |
| POST | `/posts` | Create new post |
| PUT | `/posts/:id/like` | Like or unlike a post |
| POST | `/posts/:id/comments` | Add a comment |
| GET | `/posts/:id/comments/:commentId/replies` | Get comment replies |
| PUT | `/users/:id/follow` | Follow or unfollow user |
| GET | `/notifications` | Retrieve user notifications |

---

## 🔐 Security Considerations

Security practices implemented in this project include:

- JWT-based authentication
- Protected routes for authenticated users
- Authorization headers for API requests
- Input validation handled by backend API
- Sanitized user input to prevent injection vulnerabilities

---

## 📈 What I Learned

Working on this project helped me understand several real-world engineering challenges:

- Designing reusable components improves scalability and maintainability.
- Proper API caching strategies significantly improve performance.
- Handling nested data structures requires careful UI architecture.
- Building production-like applications requires handling many edge cases not covered in tutorials.

---

## 🗺️ Roadmap

- [x] Authentication system
- [x] Posts creation and interactions
- [x] Comment and reply system
- [x] Follow users
- [x] Notifications system
- [x] Real-time notifications (WebSockets)
- [x] Dark / Light theme toggle
- [x] Infinite scroll feed
- [x] Direct messaging system

---

## 👤 Author

**Alaa Harb** — Full Stack Developer - MERN

- 🌐 [Portfolio](https://main-portfolio-lilac-eta.vercel.app/)  
- 💼 [LinkedIn](https://linkedin.com/in/alaa-harb7)  
- 🐙 [GitHub](https://github.com/alaa-harb7)  
- 📧 alaaharbofficial@email.com

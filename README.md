# StreamHub - Video Streaming Application

🎥 Video Upload, Processing & Streaming Platform

📌 Project Overview

This project is a full-stack video management and streaming application designed to simulate the core video-handling pipeline used by real-world platforms such as Instagram, YouTube, and enterprise video systems.

The application allows users to upload videos, process them for content sensitivity, track processing progress in real time, and stream videos securely based on role-based and user-controlled access permissions.
<img width="1773" height="963" alt="image" src="https://github.com/user-attachments/assets/6620fb9c-ba10-4cf6-9a5c-587765142f57" />

<img width="1853" height="955" alt="image" src="https://github.com/user-attachments/assets/5e5489ad-aa14-4f8e-8de7-03f3579f6124" />


🎯 Project Objective

The primary goal of this project is to demonstrate the ability to build a production-style, end-to-end system that handles:

Secure video uploads

Automated video processing workflows

Real-time progress updates

Controlled video visibility

Efficient and secure video streaming

This project focuses on infrastructure and system design, not social media features.

🚀 Key Features
🔹 Video Upload & Management

Drag-and-drop video upload interface

Metadata support (title, description)

Upload validation (file type & size)

Secure storage and metadata persistence

🔹 Video Processing & Sensitivity Analysis

Automated processing pipeline

Simulated sensitivity classification:

✅ Safe

⚠️ Flagged

Architecture supports future integration of ML moderation models or third-party APIs

🔹 Real-Time Processing Updates

Live progress updates (0–100%)

Implemented using Socket.io

Users can monitor processing status instantly

🔹 Secure Video Streaming

Video streaming via HTTP Range Requests

Smooth playback without full file download

Streaming endpoints protected by authentication and authorization

🔹 Controlled Video Visibility

Uploaders can control who can view their videos:

Private – Only uploader

Restricted – Selected users

Tenant-wide – All users in the same organization

Admin-only – Administrators only

🔹 Role-Based Access Control (RBAC)

Viewer – View-only access

Editor – Upload and manage videos

Admin – Full system access

🔹 Multi-Tenancy

Complete isolation between organizations

Users can only access videos within their tenant

Admins have elevated visibility within their scope

🏗️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

Socket.io Client

Backend

Node.js

Express.js

MongoDB (Mongoose)

Socket.io

JWT Authentication

Multer (file uploads)

bcrypt (password hashing)

🧩 Application Architecture (High-Level)

User uploads a video

Video metadata is stored in MongoDB

Processing pipeline starts automatically

Progress updates are pushed via WebSockets

Video is classified as Safe or Flagged

Authorized users can stream the video securely

📂 Folder Structure
Backend
backend/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── config/
 └── server.js

Frontend
frontend/
 ├── components/
 ├── pages/
 ├── context/
 ├── services/
 └── main.jsx

🔐 Security Considerations

JWT-based authentication

Passwords hashed using bcrypt

Role and tenant-based authorization checks

Protected streaming and download endpoints

Controlled video access at API and UI level

🧪 Testing

Manual testing performed for:

Video upload

Processing workflow

Role-based access

Streaming functionality

Edge cases such as unauthorized access are handled gracefully

⚙️ Setup & Installation
Prerequisites

Node.js (LTS)

MongoDB (local or cloud)

Backend Setup
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm run dev

📈 Future Enhancements

ML-based video moderation

Video compression & quality selection

Public deployment with CDN

Automated test coverage

Audit logs for admin actions

🎬 Demo

A complete video demonstration is provided showing:

User login

Video upload

Real-time processing

Controlled sharing

Secure streaming


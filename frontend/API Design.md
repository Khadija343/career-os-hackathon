# Career OS API Design

Base URL

/api/v1

---

# Authentication

POST /auth/register

Create new user.

POST /auth/login

Authenticate user.

GET /auth/profile

Return authenticated user's profile.

PUT /auth/profile

Update user profile.

---

# Dashboard

GET /dashboard

Returns

- Career Score
- Weekly Goals
- Progress
- Recent Activities

---

# Resume

POST /resume/upload

Upload resume PDF.

GET /resume

Get latest resume.

DELETE /resume

Delete uploaded resume.

POST /resume/analyze

Analyze uploaded resume.

GET /resume/report

Return AI resume report.

---

# GitHub

POST /github/connect

Connect GitHub username.

GET /github/profile

Return GitHub statistics.

POST /github/analyze

Analyze repositories.

---

# Roadmap

POST /roadmap/generate

Generate AI roadmap.

GET /roadmap

Return roadmap.

PUT /roadmap/update

Update progress.

---

# Projects

GET /projects/recommendations

Return AI recommended projects.

GET /projects

Return user projects.

POST /projects

Add project.

PUT /projects/:id

Update project.

DELETE /projects/:id

Delete project.

---

# AI Chat

POST /chat/message

Send user message.

GET /chat/history

Return conversation history.

DELETE /chat/history

Clear history.

---

# Interview

POST /interview/start

Start interview.

POST /interview/answer

Submit answer.

GET /interview/report

Return interview feedback.

---

# Goals

GET /goals

POST /goals

PUT /goals/:id

DELETE /goals/:id

---

# Response Format

Success

{
    success: true,
    data: {}
}

Failure

{
    success: false,
    message: "",
    error: {}
}
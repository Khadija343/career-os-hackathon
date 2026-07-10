# Database Schema

Database

MongoDB

---

# Collections

Users

Resumes

Roadmaps

Projects

CareerReports

Chats

Goals

InterviewSessions

GitHubProfiles

LearningResources

---

# Users

- _id
- name
- email
- password
- avatar
- careerGoal
- role
- createdAt

---

# Resume

- userId
- fileUrl
- extractedText
- atsScore
- skills
- strengths
- weaknesses
- suggestions
- uploadedAt

---

# GitHubProfile

- userId
- username
- repositories
- stars
- languages
- contributionScore
- aiAnalysis

---

# Roadmap

- userId
- targetRole
- milestones
- completedSkills
- remainingSkills
- estimatedDuration

---

# Projects

- userId
- title
- difficulty
- techStack
- status
- progress

---

# CareerReport

- userId
- careerScore
- resumeScore
- githubScore
- interviewScore
- recommendations

---

# Chat

- userId
- role
- message
- timestamp

---

# Goals

- userId
- title
- description
- completed
- dueDate

---

# InterviewSession

- userId
- questions
- answers
- feedback
- score

---

Relationships

User

↓

Resume

↓

Career Report

↓

Roadmap

↓

Goals

↓

Projects

↓

Interview Sessions

↓

Chat History
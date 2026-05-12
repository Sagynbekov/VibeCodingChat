# Product Requirements Document (PRD) - VibeChat

## 1. Overview
| Item | Description |
| :--- | :--- |
| **What** | A real-time chat application with a clear separation of frontend and backend. |
| **Who** | Students and developers demonstrating a disciplined AI-assisted workflow. |
| **Why** | To fulfill the final project requirements for the Vibe Coding course using FastAPI and React. |

## 2. Core Features (MVP)
1. **User Management**:
   - Register/Add user (Username only for MVP).
   - List all users.
   - Search users by name.
2. **Messaging**:
   - Send and receive messages.
   - Persistent chat history (saved in Firestore).
   - Search within messages.
3. **Frontend**:
   - Clean, basic design with a sidebar for users and a main chat window.
   - Message input with "Send" button.
4. **Backend**:
   - FastAPI endpoints for `/users` and `/messages`.
   - **Database**: Firebase Firestore (via `firebase-admin` SDK).

## 3. Non-Goals (CRITICAL!)
- No password-based authentication (v1 uses usernames only).
- No image/file uploads (text only).
- No deployment to AWS/GCP yet (keep it simple: Render/Railway ready).

## 4. Technical Constraints
- **Backend**: Python 3.10+, FastAPI, `firebase-admin`.
- **Frontend**: React 19 (TS), Vite, Tailwind CSS.
- **Database**: Google Firebase (Firestore).
- **Rules**: Must include `CLAUDE.md` and `GEMINI.md`.
- **Workflow**: Follow the EPCV cycle.

## 5. Success Criteria
- [ ] Backend passes `pytest`.
- [ ] Frontend displays message history correctly after refresh.
- [ ] `npm run lint` shows 0 errors.

## 6. Implementation Phases
### Phase 1: Structure & Docs
- Create folders for `backend/` and `frontend/`.
- Initialize `GEMINI.md` and `CLAUDE.md`.
### Phase 2: Backend MVP
- FastAPI models and routes for users and messages.
### Phase 3: Frontend MVP
- React components for UserList, ChatWindow, and MessageInput.
### Phase 4: Integration & Polish
- Connect frontend to backend API.

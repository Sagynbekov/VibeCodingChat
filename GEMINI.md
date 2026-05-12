# GEMINI.md

## Commands
- `npm run dev:frontend` - Start React dev server
- `python -m uvicorn backend.main:app --reload` - Start FastAPI server
- `pytest` - Run backend tests

## Structure
- `/backend` - Python FastAPI application
  - `/services` - Firestore logic (using firebase-admin)
  - `/api` - Endpoint definitions
- `/frontend` - React Vite application
  - `/src/components` - UI Components
  - `/src/services` - API client calls (calling our FastAPI)

## Style
- Python: PEP8, type hints.
- React: Functional components, Tailwind CSS.

## Boundaries
- **ALWAYS**: Consult `docs/PRD.md`.
- **ALWAYS**: Use EPCV cycle.
- **NEVER**: Add passwords or auth in Phase 1.

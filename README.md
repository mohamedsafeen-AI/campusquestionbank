# Campus Question Bank

Full-stack web app (Frontend: Vanilla JS, Backend: Node/Express, Database: Supabase).

## Features
- Public: browse/search materials
- Admin-only: upload/delete materials
- Optional PDF support via Supabase Storage
- Contact form sends email via Gmail SMTP

## Folder structure
- `frontend/` - static web UI
- `backend/` - Express API
- `supabase/` - SQL schema

## Backend setup (Vercel)
1. Create Supabase project.
2. Create Storage bucket: `question-pdfs`.
3. Run schema: `supabase/schema.sql`.
4. Copy env:
   - `backend/.env.example` → `backend/.env` and fill values.

### Required env vars (backend)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FRONTEND_ORIGIN` (Netlify URL for CORS)

## Frontend setup (Netlify)
- Deploy `frontend/` to Netlify.
- Ensure you expose:
  - `window.SUPABASE_URL` in `materials.js` usage (see code; you can set globally)
  - `window.SUPABASE_PDF_BUCKET` (default `question-pdfs`)

## Run locally
### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env
node server.js
```

### Frontend
Open `frontend/index.html` in a local server (recommended).

## GitHub push commands
```bash
git init
git add .
git commit -m "Initial Campus Question Bank scaffold"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```


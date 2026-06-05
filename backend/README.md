# Backend - Campus Question Bank

Express server exposing APIs:
- `POST /api/upload` (admin-only)
- `GET /api/materials`
- `GET /api/materials/:id`
- `DELETE /api/materials/:id` (admin-only)
- `POST /api/contact`

## Run locally

```bash
cd backend
npm install
cp .env.example .env
# edit .env
node server.js
```


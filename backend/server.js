/**
 * Campus Question Bank - Backend API
 * Node.js + Express.js + Supabase (Postgres + Storage)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const materialsRoutes = require('./routes/materials');
const contactRoutes = require('./routes/contact');

const { FRONTEND_ORIGIN, PORT } = process.env;

const app = express();

// Security headers
app.use(helmet());

// CORS: allow only the configured frontend origin
app.use(
  cors({
    origin: 'https://campusquestionbank.netlify.app', // Variable-ai thavirthu direct-a URL-ai kudunga
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Email'],
    credentials: true
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api', materialsRoutes);
app.use('/api', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const adminRoutes = require('./routes/adminRoutes');
const accountRoutes = require('./routes/accountRoutes');
const questionRoutes = require('./routes/questionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// 1. Database Connection
connectDB();

// 2. Security Headers (Cross-Origin Policy Fix for External Assets/Images)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());
app.use(cookieParser());

// 3. Dynamic CORS Configuration (Live Server, Localhost & Vercel Domains)
const allowedOrigins = [
  'https://pathum-isi.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Allow if origin is in whitelist or is any vercel.app deployment
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      } else {
        // Fallback: Allow during testing to avoid browser network block
        return callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 4. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, try again later.' },
});
app.use('/api/', limiter);

// 5. Friendly Root Route (Replaces the raw "Cannot GET /" screen)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'PATHUM ISI ACC STORE Backend API is running perfectly!',
    version: '1.0.0'
  });
});

// 6. Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 7. Mount Core API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reviews', reviewRoutes);

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// 9. Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

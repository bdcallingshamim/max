const express = require('express');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Standardized import
const router = require('./routes/route');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true })); // CORS config
app.use(helmet());
app.use(cookieParser());
app.use(mongoSanitize());

// Global rate limit (general API endpoints)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for login route
const loginLimiter = rateLimit({
  windowMs: 100 * 60 * 1000, // 5 minutes
  max: 1000, // Limit each IP to 10 requests per window for login
  message: 'Too many login attempts, please try again later.',
});


app.use('/images', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use('/api/v1', router);

mongoose
  .connect("mongodb+srv://bdcallingshamim:I6XSclGmntglH74E@cluster0.c8jdc.mongodb.net/test")
  .then(() => {
    console.log('Database connection successful!😍');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

module.exports = app;

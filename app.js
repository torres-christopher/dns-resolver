// Dependencies
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route startup
const dnsRouter = require('./routes/dnsRoutes');

// Start express app
const app = express();
app.enable('trust proxy');

// Middleware
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/dns', dnsRouter);

// Export to server
module.exports = app;

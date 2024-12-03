// Dependencies
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route startup
const dnsRouter = require('./routes/dnsRoutes');
const internalRouter = require('./routes/internalRoutes');
const viewRouter = require('./routes/viewRoutes');

// Start express app
const app = express();
app.enable('trust proxy');

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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
app.use('/', viewRouter);
app.use('/api/v1/dns', dnsRouter);
app.use('/internal/dns', internalRouter);

// Export to server
module.exports = app;

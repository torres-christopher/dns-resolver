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

// API Routes
app.use('/api/v1/dns', dnsRouter);

// Internal routes
app.get('/internal/dns', async (req, res) => {
  try {
    const { domain, type } = req.query;

    if (!domain || !type) {
      return res.status(400).json({ error: 'Domain and type are required' });
    }

    const result = await dnsService.performDNSLookup(domain, type);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export to server
module.exports = app;

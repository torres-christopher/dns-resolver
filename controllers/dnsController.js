// Dependencies
const dnsPromises = require('dns').promises;
const { performDNSLookup } = require('../services/dnsService');

// DNS by types
exports.lookupDNSType = async (req, res) => {
  try {
    const { domain, type } = req.body;

    if (!domain || !type) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Domain and type are required' });
    }

    const result = await performDNSLookup(domain, type);

    return res.status(200).json({
      status: 'success',
      data: { domain, type, result },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Test
exports.lookupTest = async (req, res) => {
  try {
    // Get body values
    const { domain, type } = req.body;

    // Check for missing values
    if (!domain || !type) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain and type are required',
      });
    }

    let result;
    // Get value
    await dnsPromises.resolveAny('tutorialspoint.com').then((response) => {
      result = response;
    });

    // Success response
    return res.status(200).json({
      status: 'success',
      data: {
        domain,
        type,
        result,
      },
    });
  } catch (error) {
    // Error response
    return res.status(400).json({
      status: 'fail',
      message: 'An error occurred during the lookup',
      error: error.message,
    });
  }
};

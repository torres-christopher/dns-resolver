// Dependencies
const dnsPromises = require('dns').promises;
const { performDNSLookup, isIPAddress } = require('../services/dnsService');

const dnsTypesGlobal = [
  'A',
  'AAAA',
  'CAA',
  'CNAME',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TXT',
];

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

// Lookup all types
exports.lookupAllDNS = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain is required',
      });
    }

    // Check for IP address and filterS PTR
    let dnsTypes = [];
    if (!isIPAddress(domain)) {
      dnsTypes = dnsTypesGlobal.filter((e) => e !== 'PTR');
    } else {
      dnsTypes = dnsTypesGlobal;
    }

    const result = {};

    // Perform DNS lookup for all types in parallel
    await Promise.all(
      dnsTypes.map(async (type) => {
        try {
          result[type] = await performDNSLookup(domain, type);
        } catch (error) {
          result[type] = { error: error.message }; // Capture errors for specific types
        }
      }),
    );

    return res.status(200).json({
      status: 'success',
      data: { domain, result },
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
    await dnsPromises.resolveAny('email.rixo.cz').then((response) => {
      console.log(response);
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

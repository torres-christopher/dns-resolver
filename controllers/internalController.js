const { performDNSLookup } = require('../services/dnsService');

// DNS by types
exports.getDNSData = async (req, res) => {
  try {
    const { domain, type } = req.query;

    if (!domain || !type) {
      return res.status(400).json({ error: 'Domain and type are required' });
    }

    const result = await performDNSLookup(domain, type);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

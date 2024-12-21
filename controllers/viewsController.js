const { performDNSLookup } = require('../services/dnsService');

exports.getOverview = async (req, res) => {
  try {
    res.status(200).render('overview', {
      title: 'Log into your account',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Render ANY DNS Results
exports.getDNSResults = async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Domain is required',
      });
    }

    // Perform an ANY DNS lookup
    const result = await performDNSLookup(domain, 'ANY');

    // Render results in a table
    res.status(200).render('result-page', {
      title: `DNS Lookup | ${domain}`,
      domain,
      result,
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: error.message,
    });
  }
};

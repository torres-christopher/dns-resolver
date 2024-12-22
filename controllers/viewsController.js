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
    console.log(result);
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

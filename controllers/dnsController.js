// Dependencies
const dnsPromises = require('dns').promises;

// Generic function to get DNS record
const getDNSRecord = async (domain, resolver) => {
  try {
    const result = await resolver(domain);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

// Map of DNS resolvers
const dnsResolvers = {
  A: dnsPromises.resolve4,
  AAAA: dnsPromises.resolve6,
  ANY: dnsPromises.resolveAny,
  CAA: dnsPromises.resolveCaa,
  CNAME: dnsPromises.resolveCname,
  MX: dnsPromises.resolveMx,
  NAPTR: dnsPromises.resolveNaptr,
  NS: dnsPromises.resolveNs,
  PTR: dnsPromises.resolvePtr,
  SOA: dnsPromises.resolveSoa,
  SRV: dnsPromises.resolveSrv,
  TXT: dnsPromises.resolveTxt,
};

// DNS by types
exports.lookupDNSType = async (req, res) => {
  try {
    // Get body values
    const { domain, type } = req.body;

    // Check for missing values
    if (!domain) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain and type are required',
      });
    } else if (type.toUpperCase() == 'ANY') {
      return res.status(400).json({
        status: 'fail',
        message: `For type: ${type} use '/api/v1/dns/lookupAll'`,
      });
    }

    // Check if the type is supported
    const resolver = await dnsResolvers[type.toUpperCase()];
    if (!resolver) {
      return res.status(400).json({
        status: 'fail',
        message: `Unsupported DNS type: ${type}`,
      });
    }

    // Get the DNS record
    result = await getDNSRecord(domain, resolver);

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
    return res.status(500).json({
      status: 'fail',
      message: 'An error occurred during the lookup',
      error: error.message,
    });
  }
};

// All DNS records
exports.lookupDNSAll = async (req, res) => {
  try {
    // Only do ANY type
    const dnsType = 'ANY';

    // Get body values
    const { domain, type } = req.body;

    // Check for missing values
    if (!domain || !type) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain and type are required',
      });
    } else if (type.toUpperCase() != dnsType) {
      return res.status(400).json({
        status: 'fail',
        message: `For type: ${type} use '/api/v1/dns/lookupType'`,
      });
    }

    const result = {};
    // Get all DNS records
    await Promise.all(
      // Go over resolvers map and for each get value
      Object.keys(dnsResolvers).map(async (type) => {
        // Skip "ANY" for individual lookups
        if (type === 'ANY') return;

        try {
          const resolver = dnsResolvers[type];
          result[type] = await getDNSRecord(domain, resolver);
        } catch (error) {
          result[type] = { error: error.message };
        }
      }),
    );

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

const { text } = require('express');

// Dependencies
const dnsPromises = require('dns').promises;

// Generic function to get DNS record
// Generic function to get DNS record
const getDNSRecord = async (domain, resolver, options = null) => {
  try {
    const result = options
      ? await resolver(domain, options)
      : await resolver(domain);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

// Check if domain is an IP address
const isIPAddress = (domain) => {
  // Check for IPv4
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

  // Check for IPv6
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}(([0-9]{1,3}\.){3,3}[0-9]{1,3})|([0-9a-fA-F]{1,4}:){1,4}:(([0-9]{1,3}\.){3,3}[0-9]{1,3}))$/;

  return ipv4Pattern.test(domain) || ipv6Pattern.test(domain);
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
    let { domain, type } = req.body;

    // Check for missing values
    if (!domain) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain and type are required',
      });
    }

    // Check for ANY
    if (type.toUpperCase() == 'ANY') {
      return res.status(400).json({
        status: 'fail',
        message: `For type: ${type} use '/api/v1/dns/lookupAll'`,
      });
    }

    // Domain check for PTR
    if (type.toUpperCase() == 'PTR' && !isIPAddress(domain)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain must be an IP address for this operation',
      });
    }

    // Options check for A and AAAA
    let options;
    if (type.toUpperCase() == 'A' || type.toUpperCase() == 'AAAA') {
      // IPv4 and IPv6 options
      options = {
        ttl: true,
      };
    }

    // Check if domain is IP address and
    if (isIPAddress(domain) && type.toUpperCase() != 'PTR') {
      try {
        domain = domain.concat('.in-addr.arpa');
        const ptrResult = await dnsPromises.resolvePtr(domain);
        if (ptrResult && ptrResult.length > 0) {
          console.log(ptrResult);
          domain = ptrResult[0]; // Replace the domain with the PTR record's result
        } else {
          return res.status(400).json({
            status: 'fail',
            message: 'PTR record not found for the given IP address',
          });
        }
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: 'Failed to resolve PTR record for the given IP address',
          error: error.message,
        });
      }
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
    result = await getDNSRecord(domain, resolver, options);

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
    let { domain, type } = req.body;

    // Check for missing values
    if (!domain) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain and type are required',
      });
    } else if (type && type.toUpperCase() != dnsType) {
      return res.status(400).json({
        status: 'fail',
        message: `For type: ${type} use '/api/v1/dns/lookupType'`,
      });
    }

    // Check if domain is IP address and
    if (isIPAddress(domain)) {
      try {
        const ipDomain = domain.concat('.in-addr.arpa');
        const ptrResult = await dnsPromises.resolvePtr(ipDomain);
        if (ptrResult && ptrResult.length > 0) {
          console.log(ptrResult);
          domain = ptrResult[0]; // Replace the domain with the PTR record's result
        } else {
          return res.status(400).json({
            status: 'fail',
            message: 'PTR record not found for the given IP address',
          });
        }
      } catch (error) {
        return res.status(400).json({
          status: 'fail',
          message: 'Failed to resolve PTR record for the given IP address',
          error: error.message,
        });
      }
    }

    // Get all DNS records
    const result = {};

    await Promise.all(
      // Go over resolvers map and for each get value
      Object.keys(dnsResolvers).map(async (type) => {
        // Skip "ANY" for individual lookups and PTR since it needs IP
        if (type === 'ANY' || type === 'PTR') return;

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
        type: type ? type : dnsType,
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

// All DNS records
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

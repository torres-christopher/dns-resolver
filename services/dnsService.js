// Dependencies
const dnsPromises = require('dns').promises;

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

// Generic function to get DNS record
const getDNSRecord = async (domain, resolver, options = null) => {
  try {
    const result = options
      ? await resolver(domain, options)
      : await resolver(domain);
    return result;
  } catch (error) {
    return { error: { code: error.code, message: error.message } };
  }
};

// DNS by types
const performDNSLookup = async (domain, type, options = null) => {
  try {
    // Uppercase type for lookup
    type = type.toUpperCase();

    // Domain check for PTR
    if (type == 'PTR' && !isIPAddress(domain)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Domain must be an IP address for this operation',
      });
    }

    // Check if domain is IP address and
    if (isIPAddress(domain) && type.toUpperCase() != 'PTR') {
      try {
        domain = domain.concat('.in-addr.arpa');
        const ptrResult = await dnsPromises.resolvePtr(domain);
        if (ptrResult && ptrResult.length > 0) {
          domain = ptrResult[0]; // Replace the domain with the PTR record's result
        } else {
          throw new Error('Domain must be an IP address for PTR lookup');
        }
      } catch (error) {
        throw new Error(
          'Failed to resolve PTR record for the given IP address',
        );
      }
    } else if (isIPAddress(domain) && type == 'PTR') {
      domain = domain.concat('.in-addr.arpa');
    }

    // Options check for A and AAAA
    if (type == 'A' || type == 'AAAA') {
      // IPv4 and IPv6 options
      options = {
        ttl: true,
      };
    }

    // Check if the type is supported
    const resolver = await dnsResolvers[type];
    if (!resolver) {
      throw new Error(`Unsupported DNS type: ${type}`);
    }

    // Get the DNS record
    result = await getDNSRecord(domain, resolver, options);

    // Success response
    return result;
  } catch (error) {
    // Error response
    throw new Error(`An error occurred during the lookup`);
  }
};

// Exports
module.exports = {
  isIPAddress,
  performDNSLookup,
};

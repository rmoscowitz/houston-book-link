import Promise from 'bluebird';
const request = Promise.promisifyAll(require("request"), {multiArgs: true});


// TODO stole following 2 functions from camerons branch, make DRY
const envOrElse = (name, defaultValue) => {
  if (typeof defaultValue == 'function') {
    return process.env[name] !== undefined
      ? process.env[name]
      : defaultValue()
  } else {
    return process.env[name] !== undefined
      ? process.env[name]
      : defaultValue
  }
}


const getOAuthToken = () => {
  const oauthUrl = 'https://oauth.overdrive.com/token';
  const clientSecret = envOrElse('OVERDRIVE_CLIENT_SECRET', () => {
    throw new Error('Must provide a OVERDRIVE_CLIENT_SECRET environment variable');
  });
  const clientId = envOrElse('OVERDRIVE_CLIENT_ID', () => {
    throw new Error('Must provie a OVERDRIVE_CLIENT_ID environment variable');
  });
  const form = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  };
  const headers = {
    'User-Agent': clientId
  };
  return request.postAsync(oauthUrl, { headers, form })
    .spread((response, body) => {
      return JSON.parse(body).access_token;
    });
};


const groupByLibrary = (data) => {
  // return an object mapping lib token to product ids it owns
  const libBooks = {};
  data.forEach(d => {
    d.locations.forEach(l => {
      libBooks[l.library_token] = libBooks[l.library_token] ? libBooks[l.library_token].concat([d.overdrive_id]) : [d.overdrive_id];
    })
  });
  return libBooks;
}

const availabilityByLibrary = (responses) => {
  // map availability response to a lookup object { lib: { product: availability, ... } }
  const lookup= {}
  responses.forEach((r) => {
    const [data, lib] = r;
    lookup[lib] = {};
    data.availability.forEach(d => {
      lookup[lib][d.id] = d;
    })
  })
  return lookup;
}

const mergeAvailabilityIntoResponse = (availability, data) => {
  const lookup = availabilityByLibrary(availability);
  return data.map(d => {
    d.locations = d.locations.map(l => {
      l.availability = lookup[l.library_token][d.overdrive_id];
      return l;
    })
    return d;
  })
}

export const addAvailability = (data) => {
  const libBooks = groupByLibrary(data);
  // make request
  const urls = Object.keys(libBooks).map(libToken => ({
    library: libToken,
    url: `https://api.overdrive.com/v1/collections/${libToken}/availability?products=${libBooks[libToken].join(',')}`
  }));
  return getOAuthToken()
    .then(token => {
      const headers = {
        "Authorization": `Bearer ${token}`
      }
      Promise.map(urls, ({library, url}) => {
        return request.getAsync(url, { headers }).spread((response, body) => {
          return [JSON.parse(body), library];
        });
      }).then(function(results) {
        return mergeAvailabilityIntoResponse(results, data);
      }).catch(function(err) {
        console.error(err);
      });
    });
}

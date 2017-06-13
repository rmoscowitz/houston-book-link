const request = require('request-promise');

function buildUrl(collection, limit, offset) {
  return `https://api.overdrive.com/v1/collections/${collection}/products?limit=${limit}&offset=${offset}`;
}

export function doRequest(token, collection, limit, offset) {
  const headers = {
    "Authorization": `Bearer ${token}`
  };
  const url = buildUrl(collection, limit, offset);
  return request.get(url, { headers: headers })
    .then(bodyString => {
      return JSON.parse(bodyString);
      return body;
    });
}

export function getOAuthToken(tokenUrl, clientId, clientSecret) {
  const form = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  };
  const headers = {
    'User-Agent': clientId
  };
  return request.post(tokenUrl, { headers, form })
    .then(bodyString => {
      return JSON.parse(bodyString);
    });
};

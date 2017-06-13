const request = require('request-promise');

function buildUrl(collection, limit, offset) {
  return `https://api.overdrive.com/v1/collections/${collection}/products?limit=${limit}&offset=${offset}`;
}

export default function doRequest(token, collection, limit, offset) {
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

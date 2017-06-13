const request = require('request-promise');

export default function getOAuthToken(tokenUrl, clientId, clientSecret) {
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

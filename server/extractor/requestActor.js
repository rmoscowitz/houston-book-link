const request = require('request');

function buildUrl(collection, limit, offset) {
  return `https://api.overdrive.com/v1/collections/${collection}/products?limit=${limit}&offset=${offset}`;
}

export const RequestActor = oauthRef => {
  return {
    doRequest: function (collection, limit, offset) {
      const ctx = this;
      oauthRef.get(function(token) {
        const headers = {
          "Authorization": `Bearer ${token}`
        };
        const url = buildUrl(collection, limit, offset);
        request.get(url, { headers: headers }, function (err, resp, bodyString) {
          if (err) return console.error('Failed to request overdrive api: ', err);
          if (resp && resp.statusCode === 200 && bodyString) {
            const body = JSON.parse(bodyString);
            ctx.reply(body);
          } else {
            console.log('Got error or empty response from overdrive ', 
                        resp && resp.statusCode,
                        bodyString);
          }
        });
      });
    }
  }
}

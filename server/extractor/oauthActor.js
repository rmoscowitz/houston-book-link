const request = require('request');
const util = require('../util.js');

/*
 const tokenUrl = "https://oauth.overdrive.com/token";
 const clientId = util.envOrElse("OVERDRIVE_CLIENT_ID", () => { 
 throw new Error("No client id specified");
 });
 const clientSecret = util.envOrElse("OVERDRIVE_CLIENT_SECRET", () => { 
 throw new Error("No client secret specified") ;
 });
 */

exports.OauthActor = function (tokenUrl, clientSecret, clientId) {
  var token;

  return {
    get: function () {
      const ctx = this;
      const self = this.self.pick('?_get');
      if (token !== undefined) {
        ctx.reply(token);
      } else {
        self._get(response => {
          ctx.setToken(response);
          ctx.reply(response);
        });
      }
    },
    _get: function() {
      const ctx = this;
      const self = this.self.pick('?_get');
      const payload = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      };
      request.post(tokenUrl, { form: payload }, function(err, resp, bodyString) {
        if (err) return console.error('Failed to get oauth', err);
        if (resp && resp.statusCode === 200 && bodyString) {
          const body = JSON.parse(bodyString);
          ctx.setToken(body.access_token);
          ctx.reply(body.access_token);
          const expiresInMillis = body.expires_in * 1000;
          setTimeout(function () {
            self._get(() => {});
          }, expiresInMillis);
        }
      });
    },
    setToken: function(newToken) {
      token = newToken;
    }
  };
}

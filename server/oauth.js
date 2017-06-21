import { envOrElse } from './util'
import oAuth2 from 'simple-oauth2';
import Promise from 'bluebird';


const creds = oAuth2.create({
  client: {
    id: envOrElse('OVERDRIVE_CLIENT_ID', () => {
      throw new Error('Must provie a OVERDRIVE_CLIENT_ID environment variable');
    }),
    secret: envOrElse('OVERDRIVE_CLIENT_SECRET', () => {
      throw new Error('Must provide a OVERDRIVE_CLIENT_SECRET environment variable');
    })
  },
  auth: {
    tokenHost: 'https://oauth.overdrive.com/token'
  }
});

const initToken = () => {
  return creds.clientCredentials
    .getToken(tokenConfig)
    .then((result) => {
      return creds.accessToken.create(result);
    })
    .catch((error) => {
      console.log('Access Token error', error.message);
    });
}

const TOKEN = null;
export default const getToken = () => {
  // Check if the token is expired. If expired it is refreshed.
  if (!TOKEN) {
    return initToken()
  }

  if (TOKEN.expired()) {
    return TOKEN.refresh()
    .then((result) => {
      TOKEN = result;
      return TOKEN;
    });
  } else {
    return Promise.return(TOKEN);
  }
}

import { envOrElse } from './util'
import oAuth2 from 'simple-oauth2';
import Promise from 'bluebird';


const CREDS = oAuth2.create({
  client: {
    id: envOrElse('OVERDRIVE_CLIENT_ID', () => {
      throw new Error('Must provide a OVERDRIVE_CLIENT_ID environment variable');
    }),
    secret: envOrElse('OVERDRIVE_CLIENT_SECRET', () => {
      throw new Error('Must provide a OVERDRIVE_CLIENT_SECRET environment variable');
    })
  },
  auth: {
    tokenHost: 'https://oauth.overdrive.com',
    tokenPath: '/token',
  },
  options: {
    bodyFormat: 'form'
  }
});

let TOKEN = null;
const initToken = () => {
  return CREDS.clientCredentials
    .getToken({})
    .then((result) => {
      TOKEN = CREDS.accessToken.create(result);
      return TOKEN.token.access_token;
    })
    .catch((error) => {
      console.log('Access Token error', error.message);
    });
}

export const getToken = () => {

  if (!TOKEN) {
    return initToken()
  } else if (TOKEN.expired()) {
    return TOKEN.refresh()
      .then((result) => {
        TOKEN = result;
        return TOKEN.token.access_token;
      });
  }
  return Promise.resolve(TOKEN.token.access_token);
}

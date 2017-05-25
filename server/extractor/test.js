const drama = require('drama');
const _ = require('lodash');
const Promise = require('bluebird');

import { OauthActor } from './oauthActor.js';
import { RequestActor } from './requestActor.js';
import { DbActor } from './dbActor.js';
import { Library, Format } from '../models.js';

const sys = drama('sys');


const oauthActor = sys.actor(OauthActor); 
oauthActor.init('https://oauth.overdrive.com/token', 'P-mFBoHG1ywzZ5ioI4nZfMKeN4b~ENh3', 'MOSCOWITZTX');
const oauthProxy = oauthActor.pick('?get');

const requestActor = sys.actor(RequestActor);
requestActor.init(oauthProxy);
const requestProxy = requestActor.pick('?doRequest');

const libraries = Library.fetchAll().then(libraries => 
  _.fromPairs(libraries.map(library => [library.attributes.collection_token, library.id]))
);
const formats = Format.fetchAll().then(formats => 
  _.fromPairs(formats.map(format => [format.attributes.key, format.id]))
);
const dbActor = sys.actor(DbActor);
Promise.all([libraries, formats]).then(function(both) {
  dbActor.init(both[0], both[1]);
  const dbProxy = dbActor.pick('?processAndStore');
  requestProxy.doRequest('v1L1BQAAAAA2e', 10, 0, function(resp) {
    dbProxy.processAndStore(resp, function(test) { console.log(test); })
  });
});

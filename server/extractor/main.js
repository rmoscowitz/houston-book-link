import os from 'os'
import Promise from 'bluebird';
import _ from 'lodash';

import { envOrElse } from '../util.js';
import { getOAuthToken, doRequest } from './overdriveRequests.js';
import { 
  processAndStore, 
  deleteUpdatedBefore, 
  updateTextSearchVector 
} from './dbFunctions.js';
import { Library, Format } from '../models.js';


function createLibrariesMap(libraries) {
  const libraryPairs = libraries.map(library => 
    [library.attributes.collection_token, library.id]
  );
  return _.fromPairs(libraryPairs);
}

function createFormatsMap(formats) {
  const formatPairs = formats.map(format => [format.attributes.key, format.id]);
  return _.fromPairs(formatPairs);
}

function initialReqForLibrary(library) {
  const collection = library.attributes.collection_token;
  return oauthTokenPromise.then(token => doRequest(token, collection, 1, 0));
}

function initialReqForLibraries(libraries) {
  const reqPromises = libraries.map(initialReqForLibrary);
  return Promise.all(reqPromises);
}

function responseToOffsets(response) {
  const total = response.totalItems;
  const collection = response.id;
  const offsets = _.range(0, total, LIMIT);
  console.log(`About to send ${Math.ceil(total / LIMIT)} (${total} books) requests for ${collection}`);
  return offsets.map(offset => [collection, offset]);
}

function collectionsAndOffsets(responses) {
  const offsets = responses.map(responseToOffsets);
  return _.flatten(offsets);
}

function doWork(oauthToken, collection, limit, offset) {
  console.log(`About to send request for books ${offset}-${offset+LIMIT} of collection ${collection}`);
  const workTime = Date.now();
  const reqPromise = doRequest(oauthToken, collection, limit, offset)
  const resultPromise = Promise.all([librariesMap, formatsMap, reqPromise])
    .then(([libraries, formats, resp]) => processAndStore(libraries, formats, resp))
  resultPromise.then(bookIds => {
    console.log(`Saved ${Object.keys(bookIds).length} books to db for ${collection} in ${elapsedTime(workTime)} s`)
  });
  return resultPromise;
}

function elapsedTime(startTime) {
    return (Date.now() - startTime) / 1000;
}


const oauthUrl = 'https://oauth.overdrive.com/token';
const clientSecret = envOrElse('OVERDRIVE_CLIENT_SECRET', () => {
  throw new Error('Must provide a OVERDRIVE_CLIENT_SECRET environment variable');
});
const clientId = envOrElse('OVERDRIVE_CLIENT_ID', () => {
  throw new Error('Must provie a OVERDRIVE_CLIENT_ID environment variable');
});
const LIMIT = 300;

const oauthTokenPromise = getOAuthToken(oauthUrl, clientId, clientSecret)
  .then(token => token.access_token);
oauthTokenPromise.then(_=> console.log('Received access token from overdrive'));

const librariesPromise = Library.fetchAll();
const librariesMap = librariesPromise.then(createLibrariesMap);
const formatsMap = Format.fetchAll().then(createFormatsMap);

const collectionsOffsetsPromise = librariesPromise
  .then(initialReqForLibraries)
  .then(collectionsAndOffsets);

const startTime = Date.now();
Promise
  .all([oauthTokenPromise, collectionsOffsetsPromise])
  .then(([token, collectionsOffsets]) => {
    // Chunk requests in order to prevent memory and connection errors
    const chunks = _.chunk(collectionsOffsets, 32);
    // Each chunk must finish before the next chunk begins
    const chunkedWorkPromise = chunks.reduce((previousPromise, chunk) => {
      return previousPromise.then(_ => {
        const workPromises = chunk.map(([collection, offset]) => {
          return doWork(token, collection, LIMIT, offset);
        });
        return Promise.all(workPromises);
      });
    }, new Promise((resolve, _) => resolve()));
    return chunkedWorkPromise;
  })
  .then(_ => deleteUpdatedBefore(Math.floor(startTime / 1000)))
  .then(count => console.log(`Deleted ${count} books that weren't updated`))
  .then(_ => updateTextSearchVector())
  .then(_ => console.log(`Finished in ${elapsedTime(startTime)} s`))
  .then(_ => process.exit())
  .catch(error => {
      console.error(error);
      process.exit(1);
  });

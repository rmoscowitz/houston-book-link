import drama from 'drama';
import os from 'os'
import Promise from 'bluebird';
import _ from 'lodash';

import OauthActor from './oauthActor.js';
import RequestActor from './requestActor.js';
import DbActor from './dbActor.js';
import Worker from './worker.js'
import { Library, Format } from '../models.js';


const leader = drama('leader')

const oauthUrl = 'https://oauth.overdrive.com/token';
const clientSecret = 'P-mFBoHG1ywzZ5ioI4nZfMKeN4b~ENh3'
const clientId = 'MOSCOWITZTX';
const LIMIT = 300;
const oauthRef = makeOauthActor(leader, oauthUrl, clientId, clientSecret);
const requestRef = makeRequestActor(leader, oauthRef)

const librariesPromise = Library.fetchAll();
const librariesMap = librariesPromise.then(libraries => {
  const libraryPairs = libraries.map(library => 
    [library.attributes.collection_token, library.id]
  );
  return _.fromPairs(libraryPairs);
});

const formatsMap = Format.fetchAll().then(formats => 
  _.fromPairs(formats.map(format => [format.attributes.key, format.id]))
);

const workerMessagesPromise = librariesPromise
  .then(libraries => {
    return Promise.all(libraries.map(library => {
      const collection = library.attributes.collection_token;
      return requestRef.doRequestAsync(collection, 1, 0);
    }));
  })
  .then(responses => {
    return _.flatten(responses.map(response => {
      const total = response.totalItems;
      const collection = response.id;
      const offsets = _.range(0, total, LIMIT);
      return offsets.map(offset => [collection, offset]);
    }));
  });

const cpus = os.cpus().length
const workerPromises = _.range(0, cpus)
  .map((_, index) => leader.fork('sys' + index))
  .map(sys => {
    const requestRef = makeRequestActor(sys, oauthRef);
    return Promise
      .all([librariesMap, formatsMap])
      .then(([libraries, formats]) => makeDbActor(sys, libraries, formats))
      .then(dbRef => makeWorkerActor(sys, requestRef, dbRef));
  });
const workersPromise = Promise.all(workerPromises);

Promise
  .all([workersPromise, workerMessagesPromise])
  .then(([workers, messages]) => {
    return Promise.all(messages.map(([collection, offset], index) => {
      const worker = workers[index % workers.length];
      return worker.doWorkAsync(collection, LIMIT, offset);
    }));
  })
  .then(console.log);

/*
 * All promisified actor refs have a "Async" version that returns
 * a promise 
 */

function ActorPromisifier(originalMethod) {
  return function promisified() {
    const args = [].slice.call(arguments);
    const self = this;
    const timeout = 20000; // 20 seconds
    // We just call the original function with resolve as the callback
    return new Promise(function(resolve, reject) {
      args.push(resolve);
      originalMethod.apply(self, args);
    }).timeout(timeout);
  };
}

function makeWorkerActor(sys, requestRef, dbRef) {
  const workerActor = sys.actor(Worker); 
  workerActor.init(requestRef, dbRef);
  return Promise.promisifyAll(workerActor.pick('?doWork'), 
                              { promisifier: ActorPromisifier });
}

function makeOauthActor(sys, url, clientId, clientSecret) {
  const oauthActor = sys.actor(OauthActor); 
  oauthActor.init(url, clientSecret, clientId);
  return Promise.promisifyAll(oauthActor.pick('?get'), 
                              { promisifier: ActorPromisifier });
}

function makeRequestActor(sys, oauthRef) {
  const requestActor = sys.actor(RequestActor);
  requestActor.init(oauthRef);
  return Promise.promisifyAll(requestActor.pick('?doRequest'), 
                              { promisifier: ActorPromisifier });
}

function makeDbActor(sys, libraries, formats) {
  const dbActor = sys.actor(DbActor);
  dbActor.init(libraries, formats);
  return Promise.promisifyAll(dbActor.pick('?processAndStore'), 
                              { promisifier: ActorPromisifier });
}

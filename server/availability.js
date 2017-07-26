import Promise from 'bluebird';
import request from 'request-promise';

import { getToken } from './oauth';


const groupByLibrary = (data) => {
  // return an object mapping lib token to product ids it owns
  const libBooks = {};
  data.forEach(d => {
    d.locations.forEach(l => {
      libBooks[l.library_token] = libBooks[l.library_token] ? libBooks[l.library_token].concat([d.overdrive_id]) : [d.overdrive_id];
    })
  });
  return libBooks;
}

const availabilityByLibrary = (responses) => {
  // map availability response to a lookup object { lib: { product: availability, ... } }
  const lookup= {}
  responses.forEach((r) => {
    const [data, lib] = r;
    lookup[lib] = {};
    data.availability.forEach(d => {
      lookup[lib][d.id] = d;
    })
  })
  return lookup;
}

const mergeAvailabilityIntoResponse = (availability, data) => {
  const lookup = availabilityByLibrary(availability);
  return data.map(d => {
    d.locations = d.locations.map(l => {
      l.availability = lookup[l.library_token][d.overdrive_id];
      return l;
    })
    return d;
  })
}

export const addAvailability = (data) => {
  const libBooks = groupByLibrary(data);
  const urls = Object.keys(libBooks).map(libToken => ({
    library: libToken,
    url: `https://api.overdrive.com/v1/collections/${libToken}/availability?products=${libBooks[libToken].join(',')}`
  }));
  return getToken()
    .then(token => {
      const headers = {
        "Authorization": `Bearer ${token}`
      }
      return Promise.map(urls, ({library, url}) => {
        return request.get(url, { headers })
          .then((response) => {
            return [JSON.parse(response), library];
        });
      }).then(function(results) {
        return mergeAvailabilityIntoResponse(results, data);
      }).catch(function(err) {
        console.error(err);
      });
    });
}

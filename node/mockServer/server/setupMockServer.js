
import libraryData from './data/libraries.json';
import authorSearch from './data/Laut_single_search.json';
import titleSearch from './data/Fenn_single_search.json';
import search from './data/search.json';
import delay from './delay.js';

exports.getMockLibraries = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(libraryData.libraries);
    }, delay());
  });
};
exports.getMockSearch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(search);
    }, delay());
  });
};
exports.getMockAuthorSearch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(authorSearch);
    }, delay());
  });
};
exports.getMockTitleSearch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(titleSearch);
    }, delay());
  });
};


import libraryData from './data/libraries.json';
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

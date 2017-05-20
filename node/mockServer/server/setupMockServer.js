
import libraryData from './data/libraries.json';
import delay from './delay.js';

exports.getMockLibraries = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(libraryData.libraries);
    }, delay());
  });
};

export default function(requestRef, dbRef) {
  return {
    doWork: function (collection, limit, offset) {
      console.log(requestRef);
      const ctx = this;
    }
  }
}

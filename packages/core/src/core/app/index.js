export default new Proxy(console, {
  get: function(target, prop) {
      if (prop in target) {
          return target[prop];
      }
      return function() {
          return undefined;
      };
  }
});
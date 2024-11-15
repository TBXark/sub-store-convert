export default new Proxy({}, {
    apply: function(target, thisArg, argumentsList) {
      console.log(`Function called with arguments: ${argumentsList.join(', ')}`);
    }
})
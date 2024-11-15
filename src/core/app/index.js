export default new Proxy(target, {
    apply: function(target, thisArg, argumentsList) {
      console.log(`Function called with arguments: ${argumentsList.join(', ')}`);
    }
})
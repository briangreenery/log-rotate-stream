var fs = require('fs'),
  path = require('path');

module.exports = function(t, dirPath, expected) {
  var actual = {};

  fs.readdirSync(dirPath).forEach(function(name) {
    actual[name] = fs.readFileSync(path.join(dirPath, name)).toString();
  });

  t.deepEqual(actual, expected);
}

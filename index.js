var fs = require('fs'),
  rotate = require('./rotate'),
  util = require('util'),
  Writable = require('stream').Writable;

util.inherits(LogRotateStream, Writable);

function LogRotateStream(path, options) {
  Writable.call(this);

  options = options || {};

  this.path = path;
  this.count = options.count || 10;
  this.maxSize = options.maxSize || 5 * 1024 * 1024;
}

LogRotateStream.prototype._write = function(chunk, encoding, cb) {
  var self = this;

  function rotateLog() {
    rotate(self.path, self.count, function(err) {
      if (err) {
        return cb(err);
      }

      writeFile();
    });
  }

  function writeFile() {
    var options = {flag: 'a', mode: 438};

    fs.writeFile(self.path, chunk, options, function(err) {
      if (err) {
        return cb(err);
      }

      cb(null);
    });
  }

  fs.stat(self.path, function(err, stats) {
    if (err && err.code !== 'ENOENT') {
      return cb(err);
    }

    if (!err && stats.size > self.maxSize) {
      return rotateLog();
    }

    writeFile();
  });
};

module.exports = function(path, options) {
  return new LogRotateStream(path, options);
};

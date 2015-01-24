var fs = require('fs');

function makePath(path, num) {
  return path + '.' + num;
}

function rotate(path, count, cb) {
  function shift(num) {
    if (num === 0) {
      return cb(null);
    }

    fs.rename(makePath(path, num - 1), makePath(path, num), function(err) {
      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }
      
      shift(num - 1);
    });
  }

  fs.unlink(makePath(path, count - 1), function(err) {
    if (err && err.code !== 'ENOENT') {
      return cb(err);
    }
    
    shift(count - 1);
  });
}

module.exports = rotate;

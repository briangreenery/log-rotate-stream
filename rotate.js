var fs = require('fs');

function makePath(path, num) {
  return path + '.' + num;
}

function rotate(path, count, cb) {
  function shift(num) {
    var src, dst = makePath(path, num);

    if (num === 0) {
      src = path;
    } else {
      src = makePath(path, num - 1);
    }

    fs.rename(src, dst, function(err) {
      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }
      
      if (num === 0) {
        cb(null);
      } else {
        shift(num - 1);
      }
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

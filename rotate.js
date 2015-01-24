var fs = require('fs');

function rotatedPath(path, num) {
  return path + '.' + num;
}

function rotate(path, count, cb) {
  function shift(num) {
    var src, dst;

    if (num === 0) {
      return cb(null);
    }

    src = rotatedPath(path, num - 1);
    dst = rotatedPath(path, num);

    fs.rename(src, dst, function(err) {
      if (err && err.code !== 'ENOENT') {
        cb(err);
      } else {
        shift(num - 1);
      }
    });
  }

  fs.unlink(rotatedPath(path, count - 1), function(err) {
    if (err && err.code !== 'ENOENT') {
      cb(err);
    } else {
      shift(count - 1);
    }
  });
}

module.exports = rotate;

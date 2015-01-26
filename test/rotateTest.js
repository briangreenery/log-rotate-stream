var fs = require('fs'),
  os = require('os'),
  path = require('path'),
  rotate = require('../rotate'),
  rimraf = require('rimraf'),
  test = require('tape');

function testDir() {
  return path.join(os.tmpdir(), 'log-rotate-stream-test');
}

function testLog() {
  return path.join(testDir(), 'test.log');
}

function cleanTestDir() {
  rimraf.sync(testDir());
}

function resetTestDir() {
  rimraf.sync(testDir());
  fs.mkdirSync(testDir());
}

function makeInitial(contents) {
  resetTestDir();

  for (var name in contents) {
    fs.writeFileSync(path.join(testDir(), name), contents[name]);
  }
}

function checkResult(t, expected) {
  var actual = {};

  fs.readdirSync(testDir()).forEach(function(name) {
    actual[name] = fs.readFileSync(path.join(testDir(), name)).toString();
  });

  t.deepEqual(actual, expected);
}

function rotateTest(count, t, initial, expected) {
  makeInitial(initial);
  rotate(testLog(), count, function(err) {
    t.error(err);
    checkResult(t, expected);
  });
}

test('no log files', function(t) {
  t.plan(2);

  var initial = {};
  var expected = {};

  rotateTest(10, t, initial, expected);
});

test('deletes last file', function(t) {
  t.plan(2);

  var initial = {
    'test.log.9': 'log 9'
  };

  var expected = {};

  rotateTest(10, t, initial, expected);
});

test('works when only some files exist', function(t) {
  t.plan(2);

  var initial = {
    'test.log.1': 'log 1',
    'test.log.4': 'log 4',
    'test.log.8': 'log 8',
    'test.log.9': 'log 9'
  };

  var expected = {
    'test.log.2': 'log 1',
    'test.log.5': 'log 4',
    'test.log.9': 'log 8'
  };

  rotateTest(10, t, initial, expected);
});

test('works when all files exist', function(t) {
  t.plan(2);

  var initial = {
    'test.log': 'original log'
  };

  for (var i = 0; i < 10; i++) {
    initial['test.log.' + i] = 'log ' + i;
  }

  var expected = {
    'test.log.0': 'original log'
  };

  for (var i = 1; i < 10; i++) {
    expected['test.log.' + i] = 'log ' + (i - 1);
  }

  rotateTest(10, t, initial, expected);
});


test('works with a different count argument', function(t) {
  t.plan(2);

  var initial = {
    'test.log': 'original log'
  };

  for (var i = 0; i < 3; i++) {
    initial['test.log.' + i] = 'log ' + i;
  }

  var expected = {
    'test.log.0': 'original log'
  };

  for (var i = 1; i < 3; i++) {
    expected['test.log.' + i] = 'log ' + (i - 1);
  }

  rotateTest(3, t, initial, expected);
});

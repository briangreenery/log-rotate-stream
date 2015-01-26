var checkDirEqual = require('./checkDirEqual'),
  createLogStream = require('../'),
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  rimraf = require('rimraf'),
  test = require('tape');

function testDir() {
  return path.join(os.tmpdir(), 'log-rotate-stream-test');
}

function testLog() {
  return path.join(testDir(), 'test.log');
}

function logTest(t, chunks, expected, options) {
  rimraf.sync(testDir());
  fs.mkdirSync(testDir());

  var stream = createLogStream(testLog(), options);

  stream.on('finish', function() {
    checkDirEqual(t, testDir(), expected);
  });

  chunks.forEach(function(chunk) {
    stream.write(chunk);
  });

  stream.end();
}

test('no log file if nothing written', function(t) {
  t.plan(1);

  var chunks = [];
  var expected = {};

  logTest(t, chunks, expected);
});

test('data is written to the log', function(t) {
  t.plan(1);

  var chunks = [
    'Hello, ',
    'world!'
  ];

  var expected = {
    'test.log': 'Hello, world!'
  };

  logTest(t, chunks, expected);
});

test('log is rotated', function(t) {
  t.plan(1);

  var chunks = [
    'chunk 1',
    'chunk 2',
    'chunk 3',
    'chunk 4',
    'chunk 5',
  ];

  var expected = {
    'test.log': 'chunk 5',
    'test.log.0': 'chunk 4',
    'test.log.1': 'chunk 3',
    'test.log.2': 'chunk 2',
  };

  var options = {
    maxSize: 1,
    count: 3
  };

  logTest(t, chunks, expected, options);
});

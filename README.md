# log-rotate-stream

Stream data to a rotating log file. When the `output.log` file grows to big, it
is moved to `output.log.0`. By default, 10 old log files are saved, and they are
always numbered in order of age. So `output.log.0` is always the most recent
archive, and `output.log.9` the oldest archive.

For example, log the output of a child process:

    var fork = require('child_process').fork,
      es = require('event-stream'),
      createLogStream = require('log-rotate-stream');
    
    var child = fork('child.js', {silent: true});
    
    es.merge(child.stdout, child.stderr).pipe(createLogStream('child.log'));

## createLogStream(path, options)

Create and return a new log stream to `path`. The optional arguments are:

* `maxSize` - When the log file exceeds this size, it will be rotated.
Default: `5 * 1024 * 1024` (5 MB)

* `count` - The number of old log files to save. Default: `10`.

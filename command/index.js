var
  glob = require('glob'),
  path = require('path');

glob.sync(__dirname + '/*.js').forEach(function(file) {
  if (file.indexOf('index.js') === -1) {
    var name = path.basename(file).replace('.js', ''), m = require('./' + name);
    module.exports[m.regex] = m.execute;
  }
});

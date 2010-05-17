require('../common');
var path = require('path')
  , childProccess = require('child_process')
  , fs = require('fs')
  , stdoutScript = path.join(path.dirname(__dirname), 'fixtures/print-chars.js')
  , tmpFile = path.join(path.dirname(__dirname), 'fixtures/stdout.txt')
  , nChars = 1024 * 100
  , cmd = process.argv[0]+' '+stdoutScript+' '+nChars+' > '+tmpFile;

try {
  fs.unlinkSync(tmpFile);
} catch (e) {}

childProccess.exec(cmd, function(err) {
  if (err) throw err;

  var data = fs.readFileSync(tmpFile);
  assert.equal(nChars, data.length);
  fs.unlinkSync(tmpFile);
});

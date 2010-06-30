var Buffer = require('buffer').Buffer

var oneMeg = 1048576
var toTest = new Buffer(oneMeg)

for (var i = 0; i < oneMeg; i++) {
  toTest.write('x')
}

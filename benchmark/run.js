var path = require("path")
var sys = require("sys")
var childProcess = require("child_process")

var benchmarkDir = path.dirname(__filename)
var dirContents = require("fs").readdirSync(benchmarkDir)

var benchmarks = dirContents.filter(function (filename) {
  return filename.match(/^bench_.*\.js$/)
})

function exec (script, callback) {
  var start = new Date()
  var child = childProcess.spawn(process.argv[0], [path.join(benchmarkDir, script)])
  child.addListener("exit", function (code) {
    var elapsed = new Date() - start
    callback(elapsed, code)
  })
}

function runNext (i) {
  if (i >= benchmarks.length) return
  sys.print(benchmarks[i] + ": ")
  exec(benchmarks[i], function (elapsed, code) {
    if (code != 0) {
      console.log("ERROR  ")
    }
    console.log(elapsed)
    runNext(i+1)
  })
}

runNext(0)

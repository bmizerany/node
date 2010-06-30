var path = require("path")
var sys = require("sys")
var fs = require("fs")
var childProcess = require("child_process")

function Bench(script) {

  function exec (script, cb) {
    var start = new Date()
    var child = childProcess.spawn(
      process.argv[0],
      [script]
    )

    child.addListener("exit", function (code) {
      var elapsed = new Date() - start
      cb(elapsed, code)
    })
  }

  this.banner = function () {
    console.log("~ " + path.basename(script, '.js'))
  }

  this.run = function (times, cb) {
    if (times <= 0) {
      cb()
      return
    }

    var that = this

    exec(script, function (elapsed, code) {
      if (code != 0) {
        console.log("ERROR")
      }

      console.log(elapsed)

      that.run(times - 1, cb)
    })
  }

}

function run (benchmarks) {
  if (benchmarks.length == 0) {
    return
  }

  var file = path.join(benchmarkDir, benchmarks.pop())
  var filepath = fs.realpathSync(file)
  var bench = new Bench(filepath)

  console.log("")
  console.log("-------------------")
  console.log(path.basename(filepath, '.js'))
  console.log("-------------------")

  bench.run(times, function () {
    run(benchmarks)
  })
}

var times = parseInt(process.env.TIMES || 5)
var benchmarkDir = path.dirname(__filename)
var dirContents = require("fs").readdirSync(benchmarkDir)
var benchmarks = dirContents.filter(function (filename) {
  return filename.match(/^bench_.*\.js$/)
})

run(benchmarks)

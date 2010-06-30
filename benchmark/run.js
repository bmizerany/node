var path = require("path")
var sys = require("sys")
var fs = require("fs")
var amath = require("./../lib/amath")
var childProcess = require("child_process")

function Bench(script) {

  this.runs = []

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

  this.run = function (times, cb) {
    var that = this

    if (times <= 0) {
      cb([
        Math.min.apply(Math, that.runs),
        Math.max.apply(Math, that.runs),
        amath.avg(that.runs).toPrecision(3),
        amath.stdev(that.runs).toPrecision(3)
      ])
      return
    }

    exec(script, function (elapsed, code) {
      if (code != 0) {
        console.log("ERROR")
      }

      that.runs.push(elapsed)
      that.run(times - 1, cb)
    })
  }

}

Bench.all = function (benchmarks) {
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

  bench.run(times, function (stats) {
    var args = ["min:%d max:%d avg:%d std:%d"].concat(stats)
    console.log.apply(console, args)
    Bench.all(benchmarks)
  })
}

var times = parseInt(process.env.TIMES || 5)
var pattern = process.env.PATTERN
var benchmarkDir = path.dirname(__filename)
var dirContents = require("fs").readdirSync(benchmarkDir)

var filter = ( pattern ?  new RegExp(pattern) : /^bench_.*\.js$/ )

var benchmarks = dirContents.filter(function (filename) {
  return filename.match(filter)
})

Bench.all(benchmarks)

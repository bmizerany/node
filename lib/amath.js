exports.sum = function (pop) {
  var sum = 0
  for (i in pop) { sum = sum + pop[i] }
  return sum
}

exports.avg = function (pop) {
  return this.sum(pop) / pop.length
}

exports.stdev = function (pop) {
  var avg = this.avg(pop)
  var devations = pop.map(function (dev) {
    return Math.pow(dev - avg, 2)
  })
  return Math.sqrt(this.avg(devations))
}

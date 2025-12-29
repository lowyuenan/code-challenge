// functions below only accept n > 0
var sum_to_n_a = function (n) {
  if (!Number.isInteger(n) || n < 0) {
    return 0
  }

  return Array.from(Array(n + 1).keys()).reduce((acc, it) => acc + it, 0)
}

var sum_to_n_b = function (n) {
  if (!Number.isInteger(n) || n < 0) {
    return 0
  }

  return (n * (n + 1)) / 2
}

var sum_to_n_c = function (n) {
  if (!Number.isInteger(n) || n < 0) {
    return 0
  }

  let sum = 0
  for (let i = 0; i <= n; i++) {
    sum += i
  }

  return sum
}

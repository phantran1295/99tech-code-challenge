var sum_to_n_a = function (n) {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
  if (n <= 0) return 0;
  var sum = 0;
  for (var i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (sum, num) => sum + num,
    0
  );
};

var sum_to_n_d = function (n) {
  if (n <= 0) return 0;
  if (n === 1) return n;
  return n + sum_to_n_c(n - 1);
};

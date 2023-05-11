const Stochastic     = require('technicalindicators').Stochastic


let high  = [127.009,127.616,126.591,127.347,128.173,128.432,127.367,126.422,126.900,126.850,125.646,125.716,127.158,127.715,127.686,128.223,128.273,128.093,128.273,127.735,128.770,129.287,130.063,129.118,129.287,128.472,128.093,128.651,129.138,128.641];
let low   = [125.357,126.163,124.930,126.094,126.820,126.482,126.034,124.830,126.392,125.716,124.562,124.572,125.069,126.860,126.631,126.800,126.711,126.800,126.134,125.925,126.989,127.815,128.472,128.064,127.606,127.596,126.999,126.900,127.487,127.397];
let close = [125.357,126.163,124.930,126.094,126.820,126.482,126.034,124.830,126.392,125.716,124.562,124.572,125.069,127.288,127.178,128.014,127.109,127.725,127.059,127.327,128.710,127.875,128.581,128.601,127.934,128.113,127.596,127.596,128.690,128.273];
let period = 14;
let signalPeriod = 3;


let input = {
  high: high,
  low: low,
  close: close,
  period: period,
  signalPeriod: signalPeriod
};

console.log(Stochastic.calculate(input));

const fs = require("fs");

const priceUnit = { 10000: "만", 100000000: "억", 1000000000000: "조" };

function transPrice(price) {
  let unit = 10000;
  if (price < unit) {
    return Math.floor(price * 100) / 100 + "";
  }
  while (unit < Number.MAX_SAFE_INTEGER) {
    if (price >= unit && price < unit * 10000) {
      return Math.floor((price * 100) / unit) / 100 + priceUnit[unit];
    }
    unit *= 10000;
  }
  return price;
}

const coinData = JSON.parse(fs.readFileSync(`${__dirname}/configDataResult.json`).toString());
for (const coin of Object.keys(coinData)) {
  console.log(coin, transPrice(coinData[coin].market_cap));
}

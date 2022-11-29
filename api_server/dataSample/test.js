const { getCoinData, getCoinMetaData, getUpbitMarketCode } = require("../data/getData");
const { getCoinInfo } = require("../data/configData");
const fs = require("fs");

async function main() {
  const upbitCodes = await getUpbitMarketCode();
  const coinInfos = getCoinInfo();

  const missingCodes = [];
  for (const code of upbitCodes) {
    if (!coinInfos[code]) {
      missingCodes.push(code);
    }
  }
  console.log("upbit의 코드로 조회되지 않는 코인갯수: ", missingCodes.length);
  console.log(missingCodes);

  for (const code of upbitCodes) {
    typeCheck(code, coinInfos[code]);
  }

  fs.writeFileSync(`${__dirname}/configDataResult.json`, JSON.stringify(coinInfos));
  console.log("test end");
}

function typeCheck(key, coin) {
  if (typeof coin.id !== "number") {
    console.log(key, coin.id);
  }
  if (typeof coin.symbol !== "string") {
    console.log(key, coin.symbol);
  }
  if (typeof coin.name !== "string") {
    console.log(key, coin.name);
  }
  if (typeof coin.slug !== "string") {
    console.log(key, coin.slug);
  }
  if (typeof coin.market_cap_dominance !== "number") {
    console.log(key, coin.market_cap_dominance);
  }
  if (typeof coin.market_cap !== "string") {
    console.log(key, coin.market_cap);
  }
  if (typeof coin.max_supply !== "number") {
    console.log(key, coin.max_supply);
  }
  if (typeof coin.circulating_supply !== "number") {
    console.log(key, coin.circulating_supply);
  }
  if (typeof coin.total_supply !== "number") {
    console.log(key, coin.total_supply);
  }
  if (typeof coin.cmc_rank !== "number") {
    console.log(key, coin.cmc_rank);
  }
  if (typeof coin.website !== "string") {
    console.log(key, coin.website);
  }
  if (typeof coin.logo !== "string") {
    console.log(key, coin.logo);
  }
  if (typeof coin.description !== "string") {
    console.log(key, coin.description);
  }
  if (typeof coin.time !== "string") {
    console.log(key, coin.time);
  }
}

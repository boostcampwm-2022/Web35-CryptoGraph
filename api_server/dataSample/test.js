const { getCoinData, getCoinMetaData, getUpbitMarketCode } = require("../data/getData");
const { getCoinInfo } = require("../data/configData");
const fs = require("fs");

async function main() {
  const upbitCodes = await getUpbitMarketCode();
  const coinInfos = await getCoinInfo();

  const missingCodes = [];
  for (const { code } of upbitCodes) {
    if (!coinInfos[code]) {
      missingCodes.push(code);
    }
  }
  console.log("upbit의 코드로 조회되지 않는 코인갯수: ", missingCodes.length);
  console.log(missingCodes);

  for (const { code } of upbitCodes) {
    typeCheck(code, coinInfos[code]);
  }

  fs.writeFileSync(`${__dirname}/configDataResult.json`, JSON.stringify(coinInfos));
  console.log("test end");
}

function typeCheck(key, coin) {
  if (typeof coin.id !== "number") {
    console.log(key, "id", coin.id);
  }
  if (typeof coin.symbol !== "string") {
    console.log(key, "symbol", coin.symbol);
  }
  if (typeof coin.name !== "string") {
    console.log(key, "name", coin.name);
  }
  if (typeof coin.name_kr !== "string") {
    console.log(key, "name_kr", coin.name_kr);
  }
  if (typeof coin.slug !== "string") {
    console.log(key, "slug", coin.slug);
  }
  if (typeof coin.market_cap_dominance !== "number") {
    console.log(key, "market_cap_dominance", coin.market_cap_dominance);
  }
  if (typeof coin.market_cap_kr !== "string") {
    console.log(key, "market_cap_kr", coin.market_cap_kr);
  }
  if (typeof coin.market_cap !== "number") {
    console.log(key, "market_cap", coin.market_cap);
  }
  if (typeof coin.max_supply !== "number") {
    console.log(key, "max_supply", coin.max_supply);
  }
  if (typeof coin.circulating_supply !== "number") {
    console.log(key, "circulating_supply", coin.circulating_supply);
  }
  if (typeof coin.total_supply !== "number") {
    console.log(key, "total_supply", coin.total_supply);
  }
  if (typeof coin.cmc_rank !== "number") {
    console.log(key, "cmc_rank", coin.cmc_rank);
  }
  if (typeof coin.website !== "string") {
    console.log(key, "website", coin.website);
  }
  if (typeof coin.logo !== "string") {
    console.log(key, "logo", coin.logo);
  }
  if (typeof coin.description !== "string") {
    console.log(key, "description", coin.description);
  }
  if (typeof coin.time !== "string") {
    console.log(key, "time", coin.time);
  }
}

main();

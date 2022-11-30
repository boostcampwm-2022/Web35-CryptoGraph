const axios = require("axios");
require("dotenv").config();

async function getUpbitMarketCode() {
  const marketCodes = await axios({
    method: "get",
    baseURL: "https://api.upbit.com",
    url: "/v1/market/all",
  }).then((response) => response.data);
  return marketCodes.reduce((acc, curr) => {
    const [moneyType, coinCode] = curr.market.split("-");
    if (moneyType === "KRW") {
      acc.push({ code: coinCode, name: curr.english_name, name_kr: curr.korean_name });
    }
    return acc;
  }, []);
}

async function getCoinData() {
  const responseBody = await axios({
    method: "get",
    baseURL: "https://pro-api.coinmarketcap.com",
    url: "v1/cryptocurrency/listings/latest?start=1&limit=600&convert=KRW",
    headers: {
      Accept: "application/json",
      "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
    },
  }).then((response) => response.data);
  return responseBody.data;
}

/**
 *
 * @param {string} coinIds 조회할 코인ID들을 ,로 연결한 문자열
 * @returns
 */
async function getCoinMetaData(coinIds) {
  const responseBody = await axios({
    method: "get",
    baseURL: "https://pro-api.coinmarketcap.com",
    url: `/v2/cryptocurrency/info?id=${coinIds}`,
    headers: {
      Accept: "application/json",
      "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
    },
  }).then((response) => response.data);
  return responseBody.data;
}

module.exports = { getUpbitMarketCode, getCoinData, getCoinMetaData };

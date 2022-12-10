const axios = require("axios");
require("dotenv").config();

// 업비트에서 marketCode받는 함수
async function getUpbitMarketCode() {
  const marketCodes = await axios({
    method: "get",
    baseURL: "https://api.upbit.com",
    url: "/v1/market/all",
  }).then((response) => response.data);
  return marketCodes.reduce((acc, curr) => {
    const [moneyType, coinCode] = curr.market.split("-");
    if (moneyType === "KRW") {
      acc.push({
        code: coinCode,
        name: curr.english_name,
        name_kr: curr.korean_name,
      });
    }
    return acc;
  }, []);
}

// 업비트에서 실시간 시세정보 가져오는 함수
async function getUpbitMarketDatas(marketCodes) {
  const responseBody = await axios({
    method: "get",
    baseURL: "https://api.upbit.com",
    url: `v1/ticker?markets=${marketCodes}`,
  }).then((response) => response.data);
  return responseBody;
}

// 코인마켓캡에서 코인정보 가져오는 함수 (시가총액, 최대발급량, 현재발급량 필요)
async function getCoinData() {
  const responseBody = await axios({
    method: "get",
    baseURL: "https://pro-api.coinmarketcap.com",
    url: "v1/cryptocurrency/listings/latest?start=1&limit=2000&convert=KRW",
    headers: {
      Accept: "application/json",
      "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
    },
  }).then((response) => response.data);
  return responseBody.data;
}

// 코인마켓캡에서 코인의 메타데이터 가져오는 함수 (코인 이미지, 코인 사이트주소, 코인설명 필요)
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

module.exports = {
  getUpbitMarketCode,
  getCoinData,
  getCoinMetaData,
  getUpbitMarketDatas,
};

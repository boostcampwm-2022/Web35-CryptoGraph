const {
  getCoinData,
  getCoinMetaData,
  getUpbitMarketCode,
  getUpbitMarketDatas,
} = require("./getData");

// 코인정보 반환하는 함수
// 업비트API를 이용하여 코인종류 확인하고 해당 코인들 정보 코인마켓캡에서 받아와 조합
async function getCoinInfo() {
  const time = getTime();
  const upbitMarketCodes = await getUpbitMarketCode();
  const result = {};
  const coinIds = [];
  // listing/latest에서 얻는 정보들 정리 result에 1차로 저장
  const coinDatas = await getCoinData();
  for (const { code, name, name_kr } of upbitMarketCodes) {
    const coinInfo = {};
    // coinData를 순회하며 알맞은 info를 찾아 저장한다.
    for (const data of coinDatas) {
      // MFT => HIFI 예외처리 (수정필요)
      if (data.symbol === "MFT" && code === "HIFI") {
        coinInfo.id = data.id;
        coinInfo.symbol = code;
        coinInfo.name = data.name;
        coinInfo.name_kr = name_kr;
        coinInfo.slug = data.slug;
        coinInfo.market_cap_dominance = data.quote.KRW.market_cap_dominance;
        coinInfo.market_cap = data.quote.KRW.market_cap;
        coinInfo.percent_change_24h = data.quote.KRW.percent_change_24h;
        coinInfo.market_cap_kr = transPrice(data.quote.KRW.market_cap);
        coinInfo.max_supply = data.max_supply;
        coinInfo.circulating_supply = data.circulating_supply;
        coinInfo.total_supply = data.total_supply;
        coinInfo.cmc_rank = data.cmc_rank;
        coinInfo.time = time;
        coinInfo.volume_24h = transPrice(data.quote.KRW.volume_24h);
        coinIds.push(data.id);
        break;
      }

      // FCT2 예외처리
      if (data.symbol === code || data.name === name) {
        coinInfo.id = data.id;
        coinInfo.symbol = code;
        coinInfo.name = data.name;
        coinInfo.name_kr = name_kr;
        coinInfo.slug = data.slug;
        coinInfo.market_cap_dominance = data.quote.KRW.market_cap_dominance;
        coinInfo.market_cap = data.quote.KRW.market_cap;
        coinInfo.percent_change_24h = data.quote.KRW.percent_change_24h;
        coinInfo.market_cap_kr = transPrice(data.quote.KRW.market_cap);
        coinInfo.max_supply = data.max_supply;
        coinInfo.circulating_supply = data.circulating_supply;
        coinInfo.total_supply = data.total_supply;
        coinInfo.cmc_rank = data.cmc_rank;
        coinInfo.time = time;
        coinInfo.volume_24h = transPrice(data.quote.KRW.volume_24h);
        coinIds.push(data.id);
        break;
      }
    }
    result[code] = coinInfo;
  }
  // info에서 얻는 메타데이터 추가 result에 2차로 저장
  const coinMetaDatas = await getCoinMetaData(coinIds.join(","));
  for (const { code } of upbitMarketCodes) {
    const coinInfo = result[code];
    const id = coinInfo.id;
    const metaData = coinMetaDatas[id];
    coinInfo.website = metaData.urls.website.length === 0 ? "" : metaData.urls.website[0];
    coinInfo.logo = metaData.logo;
    coinInfo.description = metaData.description;
  }
  return result;
}

// 업데이트 당시 시간 구하는 함수
function getTime() {
  const curr = new Date();
  const utcCurr = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  const diffFromKst = 9 * 60 * 60 * 1000;
  const kstCurr = new Date(utcCurr + diffFromKst);
  const dateString = `${kstCurr.getMonth() + 1}/${kstCurr.getDate()} ${kstCurr.getHours()}시`;
  return dateString;
}

const priceUnit = { 10000: "만", 100000000: "억", 1000000000000: "조" };

// 시가총액 변환하는 함수
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

// 메인페이지에 전달할 데이터 조합
// 기존 coinInfo의 키에 저장된 코인종류를 이용하여 업비트 API로 현재 가격 변동률받아와 조합
async function getMarketCapInfos(coinInfos) {
  if (!coinInfos) {
    return null;
  }
  const upbitMarketDatas = await getUpbitMarketDatas(
    Object.keys(coinInfos)
      .map((code) => `KRW-${code}`)
      .join(",")
  );
  const result = upbitMarketDatas.map((marketData) => {
    const code = marketData.market.split("-")[1];
    return {
      name: code,
      name_kr: coinInfos[code].name_kr,
      name_es: coinInfos[code].name,
      cmc_rank: coinInfos[code].cmc_rank,
      logo: coinInfos[code].logo,
      market_cap: coinInfos[code].market_cap,
      acc_trade_price_24h: marketData.acc_trade_price_24h,
      signed_change_rate: marketData.signed_change_rate,
    };
  });
  return result;
}

// detail페이지 전달할 데이터 조합
async function getPriceData(coinInfos) {
  if (!coinInfos) {
    return null;
  }
  const marketCodes = await getUpbitMarketCode();
  const priceData = await getUpbitMarketDatas(
    marketCodes.map(({ code }) => `KRW-${code}`).join(",")
  );
  const result = {};
  priceData.forEach((data, index) => {
    const info = {};
    const code = data.market.split("-")[1];
    info.logo = coinInfos[code].logo;
    info.name_kr = coinInfos[code].name_kr;
    info.name = coinInfos[code].symbol;
    info.price = priceData[index].trade_price;
    info.signed_change_price = priceData[index].signed_change_price;
    info.signed_change_rate = priceData[index].signed_change_rate;
    info.acc_trade_price_24h = priceData[index].acc_trade_price_24h;
    result[code] = info;
  });
  return result;
}
module.exports = { getCoinInfo, getPriceData, getMarketCapInfos };

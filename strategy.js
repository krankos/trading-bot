let MetaApi = require('metaapi.cloud-sdk').default;
const Stochastic = require('technicalindicators').Stochastic;
const EMA = require('technicalindicators').EMA;
require('dotenv').config();
var cron = require('node-cron');

let token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmNmM3M2QzYjRmNmNkMjYzNjhkMDcxMmEzNWRmMmY4NSIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImY2YzczZDNiNGY2Y2QyNjM2OGQwNzEyYTM1ZGYyZjg1IiwiaWF0IjoxNjgzNTQ4NDYxfQ.TjFMfrv5G6cWwTvd0QUTLXkec5Hq_tAJajwZhBk6aieINnnN9M9Gs-DKqo6hAhxZ2-ogixp2i2tW57EYpkwuTBUA4A4PnY1GEvlcJhTIsh9HvMvWgIDtWjiPnY8TDqFHtr3XZkwrJ2PD0m3GbL1oOFLr_4kd4rCwi4CrPraV4TOVz_3heCMq6d06b4WigajMDprO0uG2y1AC6uF7GF-pruLyUWPwdlf-jJVzL-QzlIizITpAvIRHIr1Yv9JTqTCyzfO1yLrXteudBU8e_iyDq0me3XrKhmFtuvx4Wx7KBrewBUAiP3nMSi7G333Bt8F3yEyvcY48BcWCs3avAwBhE8fDbyVBGw4ZnN8dubMV7PvOJKW1Q7gaBApxBkUwLFBjKuYwe7mfE1PuVKsGQrU8T5dN_MWwOaPTsGbHuy-DQF_NvaglZJs7gVntBj5jS9Opx6Dqp9plzfvDpDAlJ4yoOQGk2E_UmQkzNmfdqzpWaQWWXtmTMC4BJqfT0Q9jakTfwpalas2WFqYl3VGUDDJogVzaMT7wchVrm5fKFymq6FevuDWMigdMk70shkTjlDuU1uBLcooMwGz328nAeX118oY3Xsmae-6elI7AaedoWTmoE5kL1SO13qU9GVgaxDF9dare1iqRLjhnrK6CYjbYQKVH51S0--W8clAz7jKJSqw';
// console.log(process.env.TOKEN);

let accountId = process.env.ACCOUNT_ID;
// console.log(accountId);
const api = new MetaApi(token);
async function main() {
    let account = await api.metatraderAccountApi.getAccount(accountId);

    let connection = account.getStreamingConnection();
    await connection.connect();
    await connection.waitSynchronized();

    await connection.subscribeToMarketData('EURUSD');
    console.log("EURUSD price", connection.terminalState.price('EURUSD'))
    

    let candles = await account.getHistoricalCandles('EURUSD', '1h', new Date(Date.now()+ 24 * 60 * 60 * 1000), 50);

    // let tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // console.log("tomorrow", tomorrow);
    // console.log("today", new Date(Date.now()))
    console.log(candles[candles.length - 1]);
    // let candle = await connection.getLastCandle('GBPUSD', '1m');
    // console.log(candles);
    let high = candles.map(candle => candle.high);
    let low = candles.map(candle => candle.low);
    let close = candles.map(candle => candle.close);
    let signalPeriod = 3;

    let input = {
        high: high,
        low: low,
        close: close,
        period: 5,
        signalPeriod: signalPeriod,
    };

    let stochastic = Stochastic.calculate(input);
    let lastResult = stochastic[stochastic.length - 1];
    // let value = lastResult.k*0.03 + lastResult.d*0.03;
    // console.log("Stochastic",stochastic);
    console.log("Stochastic",lastResult.d, "Last stochastic", stochastic[stochastic.length-2].d);

    let ema= EMA.calculate({period: 50, values: input.close});

    console.log("EMA",ema[ema.length-1]);

    // let stopLoss=connection.terminalState.price('EURUSD').bid-0.003;
    // let takeProfit=connection.terminalState.price('EURUSD').bid+0.0035;
    // console.log("stopLoss",stopLoss);
    // console.log("takeProfit",takeProfit);
    // buy(connection, 'EURUSD', 0.05, stopLoss, takeProfit)

    // strategy
    if(((lastResult.d>20 && stochastic[stochastic.length-2].d<20)|| (lastResult.d>50 && stochastic[stochastic.length-2].d<50)) && (candles[candles.length-1].close>ema[ema.length-1]) && (candles[candles.length-1].close>candles[candles.length-1].open)){
        let stopLoss=connection.terminalState.price('EURUSD').bid-0.003;
        let takeProfit=connection.terminalState.price('EURUSD').bid+0.0035;
        console.log("stopLoss",stopLoss);
        console.log("takeProfit",takeProfit);
        buy(connection, 'EURUSD', 0.05, stopLoss, takeProfit)
        // console.log("BUY");
        return;
    }

    if (((lastResult.d<80 && stochastic[stochastic.length-2].d>80)|| (lastResult.d<50 && stochastic[stochastic.length-2].d>50)) && (candles[candles.length-1].close<ema[ema.length-1]) && (candles[candles.length-1].close<candles[candles.length-1].open)){
        let stopLoss=connection.terminalState.price('EURUSD').ask+0.0035;
        let takeProfit=connection.terminalState.price('EURUSD').ask-0.003;
        console.log("stopLoss",stopLoss);
        console.log("takeProfit",takeProfit);
        sell(connection, 'EURUSD', 0.05, stopLoss, takeProfit)
        connection.createMarketBuyOrder
        // console.log("SELL");
        return;
    }
    console.log("NOTHING");

    await connection.unsubscribeFromMarketData('EURUSD');
    // await connection.disconnect();

    // await connection .createMarketBuyOrder('EURUSD', 0.01,{comment: 'Buy signal'});

    return;
    
    process.exit(0);
}


async function buy(connection, symbol, volume, stopLoss, takeProfit) {
    let result = await connection.createMarketBuyOrder(symbol, volume,stopLoss,takeProfit ,{comment: 'Buy signal'});
    console.log('BUY', result);
    // append to file
    // fs.appendFile('log.json', result, function (err) {
    //     if (err) throw err;
    //     // console.log('Saved!');
    //   }
    // );
    
}

async function sell(connection, symbol, volume) {
    let result = await connection.createMarketSellOrder(symbol, volume, {comment: 'Sell signal'});
    console.log('SELL', result);
    // append to file
    // fs.appendFile('log.json', result, function (err) {
    //     if (err) throw err;
    //     // console.log('Saved!');
    //   }
    // );
}
var times=0
// run main every hour 
cron.schedule('0 * * * *', () => {
    console.log("%c" + 'running every hour for '+times, "color:red" + ";font-weight:bold;");
    times+=1
    main();

  }
);
// main();
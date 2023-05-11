let MetaApi = require('metaapi.cloud-sdk').default;
require('dotenv').config();

let token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmNmM3M2QzYjRmNmNkMjYzNjhkMDcxMmEzNWRmMmY4NSIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImY2YzczZDNiNGY2Y2QyNjM2OGQwNzEyYTM1ZGYyZjg1IiwiaWF0IjoxNjgzNTQ4NDYxfQ.TjFMfrv5G6cWwTvd0QUTLXkec5Hq_tAJajwZhBk6aieINnnN9M9Gs-DKqo6hAhxZ2-ogixp2i2tW57EYpkwuTBUA4A4PnY1GEvlcJhTIsh9HvMvWgIDtWjiPnY8TDqFHtr3XZkwrJ2PD0m3GbL1oOFLr_4kd4rCwi4CrPraV4TOVz_3heCMq6d06b4WigajMDprO0uG2y1AC6uF7GF-pruLyUWPwdlf-jJVzL-QzlIizITpAvIRHIr1Yv9JTqTCyzfO1yLrXteudBU8e_iyDq0me3XrKhmFtuvx4Wx7KBrewBUAiP3nMSi7G333Bt8F3yEyvcY48BcWCs3avAwBhE8fDbyVBGw4ZnN8dubMV7PvOJKW1Q7gaBApxBkUwLFBjKuYwe7mfE1PuVKsGQrU8T5dN_MWwOaPTsGbHuy-DQF_NvaglZJs7gVntBj5jS9Opx6Dqp9plzfvDpDAlJ4yoOQGk2E_UmQkzNmfdqzpWaQWWXtmTMC4BJqfT0Q9jakTfwpalas2WFqYl3VGUDDJogVzaMT7wchVrm5fKFymq6FevuDWMigdMk70shkTjlDuU1uBLcooMwGz328nAeX118oY3Xsmae-6elI7AaedoWTmoE5kL1SO13qU9GVgaxDF9dare1iqRLjhnrK6CYjbYQKVH51S0--W8clAz7jKJSqw';

let accountId = process.env.ACCOUNT_ID;
const api = new MetaApi(token);

async function main() {
    let account = await api.metatraderAccountApi.getAccount(accountId);
    let connection = account.getStreamingConnection();
    await connection.connect();
    await connection.waitSynchronized();

    await connection.subscribeToMarketData('EURUSD');

    console.log('price', connection.terminalState.price('EURUSD'))

    let result=await connection.createMarketBuyOrder('EURUSD', 0.01, connection.terminalState.price('EURUSD').bid-0.03,connection.terminalState.price('EURUSD').bid+0.035 , {comment: 'comment', clientId: 'TE_GBPUSD_7hyINWqAl'});
    console.log(result);
    await connection.unsubscribeFromMarketData('EURUSD');
}

main();
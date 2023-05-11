let MetaApi= require('metaapi.cloud-sdk').default;

const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmNmM3M2QzYjRmNmNkMjYzNjhkMDcxMmEzNWRmMmY4NSIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImY2YzczZDNiNGY2Y2QyNjM2OGQwNzEyYTM1ZGYyZjg1IiwiaWF0IjoxNjgzNTM5Nzk3fQ.V6JtqPy2qxyv7qGHM-2UsWG5MRNh7wz3wBtaNB2gww-oaCe_nREyyIV3PjRJKv6Q34GMo-nOaahD21QRtisErrNgAT1pgxPBFTLap6eTH2FjMD8lAgGnfTPkUBl0dyqK_NUS9hELQfiKZPl5eY8hnOX-wtaEzK_yOtbwLj_HbDBno0wGcoRdHyFQOxoIn6IYr8WarSRvNSMUzdX-EKCXFM40Oj6RuACDnjrnn9f7XXxX3fNicheqCBQM050nprBAcx0niihmWQKObzxNCapZob8EYhn43VJ6TjBzNGveiisk9ayBd5U1sjCltUogfWUpHLBe0ZiNwQLCuA_WyfVSS_YD3zZbzirEXjXDkjoy_CcO9mYwq7sESW8TznaIO_9epcFDzhp8_STzD9sdV5DPp4kqeN6UX-IB93dDutPxZ2Z-VBcmQiplXUGN27aQPR-e_UppfCz96xoYA3ABFzWYg_dNC_0Qs_vb9XUcTkjymge-Ajq6r82yF_iXGLg9KJzqEJ3toAkSaF_BvTbM61gApPfn5_n7l3xZ_zVyNHXeYeeBrCmPLUk3oHYV3hFByXX02CW8dzPYhzhz9YL8G_l5QG5TNc44GxnwXtg72VtsYBO86qLUJQyk3DBX2gbgjplgcke27SX6KbfUY2bkNlH9Oi4yqZdQzn2OHMEjRlJ23D4';
let accountId = "fa61aa86-a8ce-4f4a-97ab-5e64e88836a2"

const api = new MetaApi(token);

async function main() {
    try {
        let account = await api.metatraderAccountApi.getAccount(accountId);
        const initialState = account.state;
        const deployedStates = ['DEPLOYING', 'DEPLOYED']

        if (!deployedStates.includes(initialState)) {
            console.log('Deploying account');
            await account.deploy();
            
        }
        console.log('Waiting for API server to connect to broker (may take couple of minutes)');
        await account.waitConnected();

        let connection = account.getStreamingConnection();
        await connection.connect();
        await connection.waitSynchronized();

    console.log('Testing terminal state access');
    let terminalState = connection.terminalState;
    console.log('connected:', terminalState.connected);
    console.log('connected to broker:', terminalState.connectedToBroker);
    console.log('account information:', terminalState.accountInformation);
    console.log('positions:', terminalState.positions);
    console.log('orders:', terminalState.orders);
    console.log('specifications:', terminalState.specifications);
    console.log('EURUSD specification:', terminalState.specification('EURUSD'));
    await connection.subscribeToMarketData('EURUSD');
    console.log('EURUSD price:', terminalState.price('EURUSD'));

        // console.log(await connection.getSymbols());



    if(!deployedStates.includes(initialState)) {
      // undeploy account if it was undeployed
      console.log('Undeploying account');
      await connection.close();
      await account.undeploy();
    }
    } catch (err) {
        console.error(err);
    }
    finally{
        process.exit();
    }
    }
main();
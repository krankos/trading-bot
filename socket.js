import ioClient from 'socket.io-client';

const socket = ioClient('https://mt-client-api-v1.new-york.agiliumtrade.ai', {
    path: '/ws',
    reconnection: false,
    query: {
        'auth-token': 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmNmM3M2QzYjRmNmNkMjYzNjhkMDcxMmEzNWRmMmY4NSIsInBlcm1pc3Npb25zIjpbXSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6ImY2YzczZDNiNGY2Y2QyNjM2OGQwNzEyYTM1ZGYyZjg1IiwiaWF0IjoxNjgzNTQ4NDYxfQ.TjFMfrv5G6cWwTvd0QUTLXkec5Hq_tAJajwZhBk6aieINnnN9M9Gs-DKqo6hAhxZ2-ogixp2i2tW57EYpkwuTBUA4A4PnY1GEvlcJhTIsh9HvMvWgIDtWjiPnY8TDqFHtr3XZkwrJ2PD0m3GbL1oOFLr_4kd4rCwi4CrPraV4TOVz_3heCMq6d06b4WigajMDprO0uG2y1AC6uF7GF-pruLyUWPwdlf-jJVzL-QzlIizITpAvIRHIr1Yv9JTqTCyzfO1yLrXteudBU8e_iyDq0me3XrKhmFtuvx4Wx7KBrewBUAiP3nMSi7G333Bt8F3yEyvcY48BcWCs3avAwBhE8fDbyVBGw4ZnN8dubMV7PvOJKW1Q7gaBApxBkUwLFBjKuYwe7mfE1PuVKsGQrU8T5dN_MWwOaPTsGbHuy-DQF_NvaglZJs7gVntBj5jS9Opx6Dqp9plzfvDpDAlJ4yoOQGk2E_UmQkzNmfdqzpWaQWWXtmTMC4BJqfT0Q9jakTfwpalas2WFqYl3VGUDDJogVzaMT7wchVrm5fKFymq6FevuDWMigdMk70shkTjlDuU1uBLcooMwGz328nAeX118oY3Xsmae-6elI7AaedoWTmoE5kL1SO13qU9GVgaxDF9dare1iqRLjhnrK6CYjbYQKVH51S0--W8clAz7jKJSqw'
    }
});

const request =  {
    accountId: 'fa61aa86-a8ce-4f4a-97ab-5e64e88836a2',
    type: 'getSymbolPrice',
    requestId: '60440b68-f098-4f9e-b9d0-ec7149979ec9',
    symbol: 'EURUSD'
};

console.log('connecting');

socket.on('connect', () => {
    console.log('connected');
    socket.emit('request', request);
});

socket.on('error', error => {
    console.log(error);
    });

socket.on('response', response => {
  console.log(response);
});
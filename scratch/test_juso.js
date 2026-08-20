const https = require('https');

https.get('https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=TESTJUSOGOKR&keyword=%EA%B0%95%EB%82%A8%EA%B5%AC&resultType=json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
    process.exit(0);
  });
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
});

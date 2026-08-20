const https = require('https');

https.get('https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=TESTJUSOGOKR&keyword=%ED%85%8C%ED%97%A4%EB%9E%80%EB%A1%9C&resultType=json&callback=myCallback', (res) => {
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

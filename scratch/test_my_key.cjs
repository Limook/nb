const https = require('https');

const confmKey = 'U01TX0FVVEgyMDI2MDgyMDEyMDczNDEyMDA0MTM=';
const keyword = '테헤란로';

https.get(`https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=${confmKey}&keyword=${encodeURIComponent(keyword)}&resultType=json&callback=myCallback`, (res) => {
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

const https = require("https");
const qs = require("querystring");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function notify(number) {
  const data = qs.stringify({
    title: "餐厅更新",
    desp: `现有${number}个餐厅未认证`,
  });

  const options = {
    hostname: "sctapi.ftqq.com",
    port: 443,
    path: `/${process.env.SendKey}.send?${data}`,
    method: "POST",
  };

  const req = https.request(options, (res) => {
    console.log(`statu code: ${res.statusCode}`);
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}

module.exports = notify;

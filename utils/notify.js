const https = require("https");
const qs = require("querystring");

require("dotenv").config();

/**
 *
 * @param {Object} { title, body }
 */
function notify({ title, body }) {
  const data = qs.stringify({
    title: title,
    desp: body,
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

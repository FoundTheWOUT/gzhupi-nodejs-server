const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { modules, connectDB } = require("./models/index");
const notify = require("./utils/notify");

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB().then(async () => {
  console.log("connected DB!");
  app.listen(3000);
});

// app.get("/", (req, res) => {
//   res.send("hi!");
// });

app.get("/restaurant", async (req, res) => {
  let code = 200,
    result;
  let num,
    outOfRange = false;
  // if call num is greater then 20, return num to 20.
  req.query.num > 20 || !req.query.num ? (num = 20) : (num = req.query.num);
  let start = req.query.start;
  await modules.Restaurant.countDocuments(
    { authentic: true },
    function (err, count) {
      if (start > count) {
        outOfRange = true;
        code = 201;
        result = "no More!";
      }
    }
  );
  !outOfRange
    ? (result = await modules.Restaurant.findByNumber(req.query.start, num))
    : "";
  res.status(code).json(result);
});

app.post("/restaurant", async (req, res) => {
  let code, result;
  let date = new Date();
  try {
    Object.assign(req.body, { lastEditDate: date.toISOString() });
    await modules.Restaurant.create(req.body).then((data) => {
      // ! 调整通知状态
      // notify(3)
      code = 200;
      result = data;
    });
  } catch (error) {
    code = 400;
    result = error.message;
  }
  res.status(code).send(result);
});

app.put("/restaurant/:id/authentication", async (req, res) => {
  let code, result;
  try {
    const doc = await modules.Restaurant.findById(req.params.id);

    await modules.Restaurant.countDocuments({ authentic: true })
      .then(async (count) => {
        const auth = await doc.authenticate(count);
        code = auth.code;
        result = auth.message;
      })
      .catch((err) => console.error(err));
  } catch (err) {
    code = 500;
    result = err;
  }
  res.status(code).json(result);
});

app.get("/restaurant/:id/score", async (req, res) => {
  let code, result;
  try {
    const doc = await modules.Restaurant.findById(req.params.id);
    const preScore = await doc.getScore(req.query.userId);
    code = 200;
    preScore !== -1 ? (result = preScore.data) : (result = { score: -1 });
  } catch (err) {
    code = 500;
    result = err;
    console.error(err);
  }
  res.status(code).json(result);
});

app.put("/restaurant/:id/score", async (req, res) => {
  let code, result;
  try {
    const doc = await modules.Restaurant.findById(req.params.id);
    const preScore = await doc.getScore(req.body.user_id);
    // TODO: data match { user_id: Number, score: Number }
    result = await doc.updateScore(preScore, req.body);
    code = 200;
  } catch (err) {
    code = 500;
    result = err;
    console.error(err);
  }
  res.status(code).json(result);
});

module.exports = app;

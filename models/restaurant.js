const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  resID: Number,
  lastEditDate: { type: Date, required: true },
  img: { type: String, required: true },
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  userScores: Array,
  price: { type: Number, required: true },
  place: { type: String, required: true },
  tag: { type: Array, required: true },
  authentic: { type: Boolean, default: false },
  outdated: { type: Boolean, default: false },
});

restaurantSchema.methods = {
  /**
   *
   * @param {number} newResID
   * @returns {number}
   */
  authenticate: async function (newResID) {
    // TODO: 鉴权
    if (this.authentic !== true) {
      this.authentic = true;
      this.resID = newResID;
      await this.save();
      return 200;
    }
    return 201;
  },

  /**
   *
   * @param {string} userId
   * @returns {(number|object)} object of userScores if find, -1 if not find
   */
  getScore: function (userId) {
    let hasUserScoresIndex = this.userScores.findIndex((e) => {
      return e.openid === userId;
    });
    return hasUserScoresIndex === -1
      ? -1
      : {
          index: hasUserScoresIndex,
          data: this.userScores[hasUserScoresIndex],
        };
  },

  /**
   *
   * @param {Object} preScore -1 or a object of existing userScore
   * @param {Object} data { openid, score }
   * @returns {Object} { message }
   */
  updateScore: async function (preScore, data) {
    let result = { message: "" };

    // score must be less then 5
    if (data.score > 5) {
      result.message = "不能大于5";
      return result;
    }

    if (preScore !== -1) {
      this.userScores[preScore.index].score = data.score;
      result.message = "更新成功";
    } else {
      this.userScores.push(data);
      result.message = "评分成功";
    }

    let totalScore = 0;
    // count the totalScore
    this.userScores.forEach((v) => {
      totalScore += v.score;
    });
    this.score = totalScore / this.userScores.length;
    // ? this.save() not saving new array of userScore
    // await this.save().then(savedDoc => {
    //   console.log(savedDoc);
    //   savedDoc === this; // true
    // });
    await this.updateOne({
      score: this.score,
      userScores: this.userScores,
    }).then((res) => {
      console.log(res);
    });
    return result;
  },
};

restaurantSchema.statics.findByNumber = async function (start, num) {
  let resIDArr = [];
  while (num > 0) {
    resIDArr.push(Number(start));
    start++;
    num--;
  }
  return await this.find({ resID: { $exists: true, $in: resIDArr } });
};

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;

const mongoose = require("mongoose");

const restaurantScoreSchema = new mongoose.Schema({
  restaurantID: { type: String, required: true },
  score: { type: Number, default: 0 },
  userScores: Array,
});

restaurantScoreSchema.statics.getScore = async function(id){
  return this.findById(id)
}

const RestaurantScore = mongoose.model(
  "RestaurantScore",
  restaurantScoreSchema
);

module.exports = RestaurantScore;

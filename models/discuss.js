const mongoose = require("mongoose");

const discussSchema = new mongoose.Schema({
  discussID: { type: Number, required: true },
  // TODO: if no avatar, random a from net
  avatar: { type: String, default: "" },
  comment: { type: String, required: true },
});

const Discuss = mongoose.model("Discuss", discussSchema);

module.exports = Discuss;

const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    favorites: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", schema);

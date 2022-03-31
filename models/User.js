const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    // image: String,
    favorites: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", schema);

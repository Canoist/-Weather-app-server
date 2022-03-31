const favoritesMock = require("../mock/favorites.json");
const Favorite = require("../models/Favorite");

module.exports = async () => {
  const favorites = await Favorite.find();
  if (favorites.length !== favoritesMock.length) {
    await setInitialData(Favorite, favoritesMock);
  }
};

async function setInitialData(Model, data) {
  await Model.collection.drop();
  return Promise.all(
    data.map(async (item) => {
      try {
        delete item._id;
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (error) {
        return error;
      }
    })
  );
}

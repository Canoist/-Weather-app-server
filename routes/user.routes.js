const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true });

router.patch("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id) {
      const updateUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      res.send(updateUser);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже" });
  }
});

router.delete("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id) {
      const user = await User.findById(req.user._id);
      const deleted = await user.deleteOne();
      res.send(deleted);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "На сервере произошла ошибка. Попробуйте позже" });
  }
});

module.exports = router;

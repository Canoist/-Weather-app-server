const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const app = express();
const initDataBase = require("./startUp/initDataBase");
const router = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);

const PORT = config.get("port") ?? 8080;

// if (process.env.NODE_ENV === "production") {
//   console.log("Production");
// } else {
//   console.log("Development");
// }

async function start() {
  try {
    mongoose.connection.once("open", () => {
      initDataBase();
    });
    await mongoose.connect(config.get("mongoUri"));
    console.log(chalk.green(`MongoDB connected`));
    app.listen(PORT, () => {
      console.log(chalk.green(`Server has been started on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

start();
const mongoose = require("mongoose");

module.exports.initiateDBConnection = async () => {
  mongoose
    .connect(process.env.mongoURI)
    .then(() => {
      console.log("Connected to DB.");
    })
    .catch((err) => {
      console.log(err);
    });
};

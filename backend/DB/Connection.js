const mongoose = require("mongoose");

const URI =
  "mongodb+srv://dbuser:dbuser@cluster0.luxr9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("database connected");
};

require("./User");
module.exports = connectDB;

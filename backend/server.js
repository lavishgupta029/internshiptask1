const express = require("express");
const cors = require("cors");
const connectDB = require("./DB/Connection");
const path = require("path");
const app = express();
const fs = require("fs");
const authRouter = require("./route/User");
const http = require("http");
app.use(cors());
connectDB();

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api", authRouter);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Checking for operational/trusted errors
app.use((error, req, res, next) => {
  if (req.file) {
    console.log(req.file);
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  // Checking for operational/trusted errors
  if (error.isOperational) {
    res.status(error.code);
    res.json({ message: error.message });
  }

  // Unknown or Development based errors
  else {
    console.error(error);
    res.status(500).json({
      message: "An Unknown error has Occured",
    });
  }
});

const PORT = process.env.PORT || 3001;
//const server = http.createServer(app);

app.listen(PORT, () => console.log("Server started"));

// handling unhandled promises(safety net)
// process.on("unhandledRejection", (err) => {
//   console.log(
//     "Unhandled Rejection (Some Promise is unresolved)! Shutting down server..."
//   );
//   console.log(err.name, err.message);
//   app.close(() => {
//     process.exit(1);
//   });
// });

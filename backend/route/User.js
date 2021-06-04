const express = require("express");
const router = express.Router();
const multer = require("multer");
const shortid = require("shortid");
const authorization = require("../Controller/User");
const HttpError = require("../http-error");
const authenticate = require("../middlewares/authentication");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new HttpError("Not an valid MIMETYPE", 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });

router.post("/signup", authorization.SignUp);
router.post("/signin", authorization.Signin);
router.get("/getuser", authenticate, authorization.GetUser);
router.patch(
  "/updateuser",
  upload.single("photo"),
  authenticate,
  authorization.UpdateUser
);
router.patch("/updatepassword", authenticate, authorization.UpdatePassword);

module.exports = router;

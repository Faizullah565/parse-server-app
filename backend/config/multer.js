import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "./awsS3Config.js";
// import s3 from "./s3.js";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "aws-s3-parse-server-bucket",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  })
});

export default upload;
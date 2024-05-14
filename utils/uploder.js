const path = require("path");
const multer = require("multer");
const createError = require("http-errors");
const uploderFile = {};

uploderFile.singleUploder = (
  subFolder_path,
  allowed_fill_types,
  fileSizeLimit,
  err_msg
) => {
  const UPLOAD_FOLDER = path.join(__dirname, `../uploads/${subFolder_path}`);

  const storage = multer.diskStorage({
    destination: (req, fill, callback) => {
      callback(null, UPLOAD_FOLDER);
    },
    filename: (req, fill, callback) => {
      const fillExt = path.extname(fill.originalname);
      const filename =
        fill.originalname
          .replace(fillExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      callback(null, filename + fillExt);
    },
  });

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: fileSizeLimit, // 1 Mb
    },

    fileFilter: (req, fill, callback) => {
      if (allowed_fill_types.includes(fill.mimetype)) {
        callback(null, true);
      } else {
        callback(createError(err_msg));
      }
    },
  });

  return upload;
};

module.exports = uploderFile;

const { singleUploder } = require("../utils/uploder");

const fileUpload = {};

fileUpload.imageUpload = (req, res, next) => {
  
  const upload = singleUploder(
    "users",
    ["image/png", "image/jpg", "image/jpeg"],
    1024 * 1024 * 10,
    "only .png, .jpg or .jpeg format allowed!"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          image: {
            message: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
  
};

module.exports = fileUpload;

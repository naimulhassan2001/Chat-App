const bcrypt = require("bcrypt");
const createError = require("http-errors");

const password = {};

password.hash = async (pass) => {
  try {
    const hashPassword = await bcrypt.hash(pass, 10);
    return hashPassword;
  } catch (err) {
    console.log(err);
    throw new createError(403, err);
  }
};

password.checkPassword = async (pass, hashPass) => {
  console.log(pass);
  console.log(hashPass);
  try {
    const isValid = await bcrypt.compare(pass, hashPass);
    return isValid;
  } catch (err) {
    throw new createError(403, err);
  }
};
module.exports = password;

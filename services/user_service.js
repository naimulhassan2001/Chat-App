const UserModel = require("../model/people");
const { hash, checkPassword } = require("../services/hash_password");
const createError = require("http-errors");

const service = {};

service.save = async (req) => {
  try {
    const hashPassword = await hash(req.body.password);
    let userData;
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      console.log(filename);
      const newUser = new UserModel({
        ...req.body,
        password: hashPassword,
        image: `uploads/users/${filename}`,
      });
      userData = await newUser.save();
    } else {
      const newUser = new UserModel({
        ...req.body,
        password: hashPassword,
      });
      userData = await newUser.save();
    }
    userData = userData.toObject();
    delete userData.password;
    delete userData.__v;
    return userData;
  } catch (error) {
    throw new createError(error);
  }
};

service.find = async () => {
  try {
    const users = await UserModel.find({}, "_id name email number image role");

    return users;
  } catch (error) {
    throw new createError(error);
  }
};

service.findById = async (id) => {
  try {
    console.log(id);
    if (id.length != 24) throw createError(400, "_id is invalid");
    const user = await UserModel.findOne(
      { _id: id },
      "_id name email number image role"
    );
    console.log(user);

    if (!user) {
      throw new createError(404, "User not found");
    }
    return user;
  } catch (err) {
    throw new createError(err);
  }
};

service.findByEmail = async (email) => {
  try {
    const user = await UserModel.findOne(
      { email },
      "_id name email number image role password otp expireTime"
    );
    console.log(user);

    if (!user) {
      throw new createError(404, "User not found");
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = service;

const userModel = require("../model/people");
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
        image: filename,
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
    delete user.__v;
    return userData;
  } catch (error) {
    throw new createError(error);
  }
};

service.find = async () => {
  try {
    let users = await userModel.find();
    users = users.map((user) => {
      let userObj = user.toObject();
      delete userObj.password;
      delete user.__v;
      return userObj;
    });
    return users;
  } catch (error) {
    throw new createError(error);
  }
};

service.findById = async (id) => {
  try {
    if (id.length != 24) throw createError(400, "_id is invalid");
    let user = await userModel.findOne({ _id: id });
    console.log(user);

    if (!user) {
      throw new createError(404, "User not found");
    }

    user = user.toObject();
    delete user.password;
    delete user.__v;
    return user;
  } catch (err) {
    throw err;
  }
};

service.findByEmail = async (email) => {
  try {
    let user = await userModel.findOne({ email });
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

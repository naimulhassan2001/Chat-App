const mongoose = require("mongoose");

const helper = {};

helper.userData = (userData) => {
  const user = {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    nubmer: userData.number,
    image: userData.image,
    role: userData.role
  };

  return user;
};

module.exports = helper;

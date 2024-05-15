const Notification = require("../model/notification");
const createError = require("http-errors");

const service = {};

service.addNotification = async (notificationBody) => {
  try {
    const notification = new Notification(notificationBody);
    await notification.save();
    return notification;
  } catch (error) {
    throw new createError(error);
  }
};

service.addMultipleNofiications = async (data) => {
  try {
    return await Notification.insertMany(data);
  } catch (error) {
    throw new createError(error);
  }
};

service.getNotificationById = async (id) => {
  try {
    if (id.length != 24) throw new createError(400, "id is invalid");
    return await Notification.findById(id);
  } catch (error) {
    throw new createError(error);
  }
};

module.exports = service;

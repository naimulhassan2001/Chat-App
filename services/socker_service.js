const {
  addChat,
  getChatByParticipants,
  getChatById,
  getChatByParticipantId,
} = require("./chat_service");
const { log } = require("../helper/logger");
const { addNotification } = require("./notification_service");
const { addConversaton } = require("./conversation_service");
const Chat = require("../model/chat");

const service = {};

service.createRoom = async (socket, data, callback) => {
  try {
    let chat;

    if (data?.participants?.length >= 2) {
      chat = await getChatByParticipants(data);

      if (chat) {
        callback({
          status: true,
          message: "Chat already exists",
          data: chat,
        });
      }

      chat = await addChat(data);

      socket.join(chat._id);

      if (chat) {
        callback({
          status: true,
          message: "Chat create successful",
          data: chat,
        });
      }

      console.log(chat);

      data.participants.forEach(async (participant) => {
        if (participant.toString() !== data.creator) {
          const userNotification = {
            message: "Request a new message in " + data?.name,
            receiver: participant,
            linkId: chat._id,
          };
          const userNewNotification = await addNotification(userNotification);
          const roomId = "user-notification::" + participant.toString();
          console.log(userNewNotification);
          io.emit(roomId, userNewNotification);
        }
        // const roomID = 'chat-notification::' + participant.toString();
        // io.emit(roomID, { status: "Success", message: "New chat created", data: null });
      });

      return;
    } else {
      log("socket error", "socket");
      callback({
        status: "Error",
        message: "Must provide at least 2 participants",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error adding new chat:", error.message);
    callback({ status: "Error", message: error.message, data: null });
  }
};

module.exports = service;

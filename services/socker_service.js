const { addChat, getChatByParticipants } = require("./chat_service");

const socketIO = (io) => {
  // io.use((socket, next) => {
  //   const token = socket.handshake.headers.authorization;
  //   if (!token) {
  //     return next(new Error('Authentication error: Token not provided.'));
  //   }

  //   // Extract the token from the Authorization header
  //   const tokenParts = token.split(' ');
  //   const tokenValue = tokenParts[1];

  //   // Verify the token
  //   jwt.verify(tokenValue, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
  //     if (err) {
  //       console.error(err);
  //       return next(new Error('Authentication error: Invalid token.'));
  //     }
  //     // Attach the decoded token to the socket object for further use
  //     socket.decodedToken = decoded;
  //     next();
  //   });
  // });

  io.on("connection", (socket) => {
    console.log(`ID: ${socket.id} just connected`);

    socket.on("add-new-chat", async (data, callback) => {
      try {
        let chat;
        if (data?.participants?.length >= 2) {
          chat = await getChatByParticipants(data);

          if (chat) {
            return callback({
              status: true,
              message: "Chat already exists",
              data: chat,
            });
          }

          chat = await addChat(data);

          if (chat) {
            return callback({
              status: true,
              message: "Chat already exists",
              data: chat,
            });
          }

          console.log(chat);

          //   data.participants.forEach(async (participant) => {
          //     if (participant.toString() !== data.groupAdmin) {
          //       const userNotification = {
          //         message:
          //           "You have been added in " + data?.groupName + " -group",
          //         receiver: participant,
          //         linkId: chat._id,
          //         type: "group-request",
          //         role: "user",
          //       };
          //       const userNewNotification = await addNotification(
          //         userNotification
          //       );
          //       const roomId = "user-notification::" + participant.toString();
          //       io.emit(roomId, userNewNotification);
          //     }
          //     // const roomID = 'chat-notification::' + participant.toString();
          //     // io.emit(roomID, { status: "Success", message: "New chat created", data: null });
          //   });
          return;
        } else {
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
    });

    socket.on("add-new-message", async (data, callback) => {
      try {
        data.messageType = "message";
        // const message = await addMessage(data);
        const message = "new message";
        // const eventName = "new-message::" + data.chat.toString();
        const eventName = "new-message::123";
        io.emit(eventName, data);
        // if (chat && chat.type === "single") {
        //   const eventName1 =
        //     "update-chatlist::" + chat.participants[0].toString();
        //   const eventName2 =
        //     "update-chatlist::" + chat.participants[1].toString();
        //   const chatListforUser1 = await getChatByParticipantId(
        //     { participantId: chat.participants[0] },
        //     { page: 1, limit: 10 }
        //   );
        //   const chatListforUser2 = await getChatByParticipantId(
        //     { participantId: chat.participants[1] },
        //     { page: 1, limit: 10 }
        //   );
        //   io.emit(eventName1, chatListforUser1);
        //   io.emit(eventName2, chatListforUser2);
        // }
        callback({
          status: "Success",
          message: "Message send successfully",
          data: data,
        });
      } catch (error) {
        console.error("Error adding new message:", error.message);
      }
    });

    // socket.on("get-messages", async (data, callback) => {
    //   try {
    //     const messages = await messageService.getMessageByChatId(data.chatId);
    //     if (messages.length > 0) {
    //       callback({ status: "Success", message: "Messages", data: messages });
    //     }
    //   } catch (error) {
    //     console.error("Error getting messages:", error.message);
    //     logger.error("Error getting messages:", error.message);
    //     callback({ status: "Error", message: error.message });
    //   }
    // });

    // socket.on("chat-list", async (data, callback) => {
    //   try {
    //     const chats = await chatService.getChats(
    //       data?.filter,
    //       data?.options,
    //       data?.userId
    //     );
    //     if (chats.length > 0) {
    //       callback({ status: "Success", message: "Chat list", data: chats });
    //     }
    //   } catch (error) {
    //     console.error("Error getting chat list:", error.message);
    //     logger.error("Error getting chat list:", error.message);
    //     callback({ status: "Error", message: error.message });
    //   }
    // });

    // socket.on("leave-room", (data) => {
    //   if (data?.roomId) {
    //     socket.leave("room" + data.roomId);
    //   }
    // });

    // socket.on("typing", function (data) {
    //   socket.broadcast.to(socket.roomId).emit("startedTyping", data);
    // });

    // socket.on("typingStopped", function (data) {
    //   socket.broadcast.to(socket.roomId).emit("stoppedTyping", data);
    // });

    socket.on("disconnect", () => {
      console.log(`ID: ${socket.id} disconnected`);
    });
  });
};

module.exports = socketIO;

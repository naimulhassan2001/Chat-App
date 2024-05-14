const express = require("express");
const http = require("http");
const soket_io = require("socket.io");
const { globalRrrorHandler, notFoundRoute } = require("./common/error");
const mainRouter = require("./router/main_router");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECT_STRING)
  .then(() => console.log("mongoose connect successfully"))
  .catch((e) => console.log(e));
dotenv.config();

const server = http.createServer(app);
const io = soket_io(server);
global.io = io;

io.on("connection", (soket) => {
  soket.on("test", (data, callback) => {
    console.log(data);

    callback("Naimul Hassan");
  });

  console.log("client connected");
});

app.use(express.json());

app.use(mainRouter);

app.use(notFoundRoute);
app.use(globalRrrorHandler);

server.listen(5000, () => {
  console.log("server listening in 5000 port");
});

module.exports = app;

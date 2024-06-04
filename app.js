const express = require("express");
const http = require("http");
const soket_io = require("socket.io");
const { globalRrrorHandler, notFoundRoute } = require("./common/error");
const mainRouter = require("./router/main_router");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketIo = require("./services/socker_service");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

socketIo(io);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(mainRouter);

app.use(notFoundRoute);
app.use(globalRrrorHandler);

server.listen(5000, () => {
  console.log("server listening in 5000 port");
});

module.exports = app;

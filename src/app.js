require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router'); 
const carsRouter = require('./cars/cars-router');
const commentsRouter = require('./comments/comments-router');
const dtcRouter = require('./dtc/dtc-router');
const vinMakeRouter = require('./vinmake/vinmake-router');
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = (NODE_ENV === "production")
  ? "tiny"
  : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/cars', carsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/dtc', dtcRouter)
app.use('/api/vinmake', vinMakeRouter)

app.use(function errorHandler(error, req, res, next) {
  console.error(error)
  let response
  if (NODE_ENV === "production") {
    response = { error: { message: "server error"} }
  } else {
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app;

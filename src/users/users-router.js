const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post("/", jsonBodyParser, (req, res, next) => {
  const { password, username, nickname } = req.body;

  for (const field of ["username", "nickname", "password"])
    if (!req.body[field])
      return res
        .status(400)
        .json({
          error: {
            message: `Missing '${field}' in request body.`,
          },
      });
    
    const usernameError = UsersService.validateUsername(username);
    const passwordError = UsersService.validatePassword(password);

    if (usernameError) return res
      .status(400)
      .json({
        error: {
          message: usernameError,
        },
      });

    if (passwordError) return res
      .status(400)
      .json({
        error: {
          message: passwordError,
        },
      });

    UsersService.hasUserWithUsername(
      req.app.get("db"),
      username
    )
    .then((hasUserWithUsername) => {
      if (hasUserWithUsername)
        return res
          .status(400)
          .json({
            error: {
              message: `Username exists.`
            },
          });

      return UsersService.hashPassword(password)
        .then((hashedPassword) => {
        const newUser = {
          username,
          password: hashedPassword,
          nickname,
          date_created: "now()",
        };

          return UsersService.insertUser(
            req.app.get("db"),
            newUser)
            .then((user) => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
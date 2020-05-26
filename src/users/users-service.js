const bcrypt = require("bcryptjs");
const xss = require("xss");
const moment = require("moment");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const REGEX_USERNAME = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UsersService = {
  hasUserWithUsername(db, username) {
    return db("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },

  validateUsername(username) {
    if (!REGEX_USERNAME(username)) {
      return "Username must be a valid email address."
    }
    return null;
  },

  validatePassword(password) {
    if (password.length < 8) {
      return "Password be longer than 8 and less than 72 characters.";
    }
    if (password.length > 72) {
      return "Password be longer than 8 and less than 72 characters.";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces.";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must include one upper case, lower case, number, and special character.";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      nickname: xss(user.nickname),
      date_created: moment(new Date(user.date_created))
        .format()
    };
  },
};

module.exports = UsersService;

require("dotenv").config();

const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");
const mongoose = require('mongoose');
// const db = knex({
//   client: "pg",
//   connection: DATABASE_URL,
// });

// app.set("db", db);

// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// });

mongoose.connect(DATABASE_URL, err => {
    if (err) {
        return console.error(err);
    }

    console.log(`Connected to db at ${DATABASE_URL}`);

    const server = app.listen(PORT, () => {
        console.log(`Listen to port ${PORT}`, new Date().toString());
    });

    // const io = socket(server);
    // startSockets(io);

});


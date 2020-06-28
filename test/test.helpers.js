const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeDtcFixtures() {
  const testUsers = makeUsersArray();
  const testDtc = makeDtcArray();
  const testComments = makeCommentsArray(testUsers, testDtc);
  return { testUsers, testDtc, testComments }
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "testuser1@gmail.com",
      nickname: "testuser1",
      password: "@ABCabc123",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      username: "testuser2@gmail.com",
      nickname: "testuser2",
      password: "@ABCabc123",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      username: "testuser3@gmail.com",
      nickname: "testuser3",
      password: "@ABCabc123",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      username: "testuser4@gmail.com",
      nickname: "testuser4",
      password: "@ABCabc123",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 5,
      username: "testuser5@gmail.com",
      nickname: "testuser5",
      password: "@ABCabc123",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeDtcArray() {
  return [
    {
      id: 1,
      dtc: "P1100",
      description: "BARO Sensor Circuit",
      vinmake_id: "1"
    },
    {
      id: 2,
      dtc: "P1120",
      description: "Accelerator Pedal Position Sensor Circuit",
      vinmake_id: "1"
    },
    {
      id: 3,
      dtc: "P1121",
      description: "Accelerator Pedal Position Sensor Range/Performance Problem",
      vinmake_id: "1"
    },
    {
      id: 4,
      dtc: "P1125",
      description: "Throttle Control Motor Circuit",
      vinmake_id: "1"
    },
    {
      id: 5,
      dtc: "P1106",
      description: "Barometric Pressure Circuit Range/Performance",
      vinmake_id: "2"
    },
  ]
}

function makeCommentsArray(users, dtc) {
  return [
    {
      id: 1,
      comment: "First test comment.",
      vinmake_id: "1",
      dtc_id: dtc[0].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      comment: "Second test comment.",
      vinmake_id: "1",
      dtc_id: dtc[0].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      comment: "Third test comment.",
      vinmake_id: "1",
      dtc_id: dtc[0].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      comment: "Fourth test comment.",
      vinmake_id: "2",
      dtc_id: dtc[0].id,
      user_id: users[3].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 5,
      comment: "Five test comment.",
      vinmake_id: "4",
      dtc_id: dtc[0].id,
      user_id: users[4].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        comments,
        dtc,
        cars,
        vinmake, 
        users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE dtc_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE cars_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE vinmake_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('comments_id_seq', 0)`),
          trx.raw(`SELECT setval('dtc_id_seq', 0)`),
          trx.raw(`SELECT setval('cars_id_seq', 0)`),
          trx.raw(`SELECT setval('vinmake_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

function seedDtcTables(db, dtc) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await trx.into('dtc').insert(dtc)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('dtc_id_seq', ?)`,
      [dtc[dtc.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (dtc.length) {
      await trx.into('dtc').insert(dtc)
      await trx.raw(
        `SELECT setval('dtc_id_seq', ?)`,
        [dtc[dtc.length - 1].id],
      )
    }
  })
}

function makeExpectedDtcComments(dtcId, comments, users) {
  const expectedComments = comments
    .filter(comment => comment.dtc_id === dtcId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      comment: comment.comment,
      date_created: comment.date_created.toISOString(),
      date_modified: comment.date_modified.toISOString(),
      vinmake_id: {
        id: vinmake.id,
        make_vin: vinmake.make_vin,
        short_vin: vinmake.short_vin,
      },
      dtc_id: {
        id: dtc.id,
        dtc: dtc.dtc,
        description: dtc.description,
        vinmake_id: dtc.vinmake_id,
      },
      user_id: {
        id: commentUser.id,
        username: commentUser.username,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString()
      }
    }
  })
}

module.exports = {
  makeCommentsArray,
  makeCommentsFixtures,
  cleanTables,
  seedUsers,
  makeAuthHeader,
  makeDtcFixtures,
  seedDtcTables,
  makeExpectedDtcComments
};

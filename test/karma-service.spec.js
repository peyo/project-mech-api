const knex = require("knex");
const CommentsService = require("../src/comments/comments/-service");
const TestUsers = require("./data/test-users");
const TestKarma = require("./data/test-karma");
const { expect } = require("chai");

describe(`Karma service object`, function () {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.DATABASE_URL,
    });
  });

  before(() => {
    return db.raw("TRUNCATE TABLE users, comments, karma CASCADE");
  });

  afterEach(() => {
    return db.raw("TRUNCATE TABLE users, comments, karma CASCADE");
  });

  after(() => {
    return db.destroy();
  });

  context(`Given "karma" has data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });

    beforeEach(() => {
      return db.into("comments").insert(TestGroups);
    });

    beforeEach(() => {
      return db.into("karma").insert(TestKarma);
    });

    it(`getByCommentId() resolves a comment by id from "karma" table"`, () => {
      const id = 1;
      const testKarma = TestKarma.filter(elements => elements.comments_id === id);

      return KarmaService.getByCommentId(db, id).then((actual) => {
        expect(actual).to.eql([{
          id: testKarma[0].id,
          karma: testKarma[0].karma,
          user_id: testKarma[0].user_id,
          comment_id: id
        },
        {
          id: testKarma[1].id,
          karma: testKarma[1].karma,
          user_id: testKarma[1].user_id,
          comment_id: id
        }]);
      });
    });

    it(`getById() resolves a comment from "karma" table"`, () => {
      const id = 1;
      const testKarma = TestKarma[id - 1];

      return CommentsService.getById(db, id).then((actual) => {
        expect(actual).to.eql({
          id: id,
          karma: testKarma.karma,
          user_id: testKarma.user_id,
          comment_id: testKarma.comment_id
        })
      })
    });

    it(`updateKarma() updates a comment's karma point"`, () => {
      const id = 1;
      const newKarma = {
        id: id,
        karma: testKarma.karma[id - 1] + 1,
        user_id: testKarma.user_id[id - 1],
        comment_id: testKarma.comment_id[id - 1]
      };

      return KarmaService.updateKarma(db, id, newKarma)
        .then(() => KarmaService.getById(db, id))
        .then((karma) => {
          expect(karma).to.eql({
            id: id,
            ...newKarma,
          });
        });
    });
  });

  context(`Given "karma has no data.`, () => {
    beforeEach(() => {
      return db.into("users").insert(TestUsers);
    });

    beforeEach(() => {
      return db.into("comments").insert(TestGroups);
    });

    it(`insertKarma() adds karma point to comment and resolves new karma with an id`, () => {
      let newKarma = {
        karma: 1,
        user_id: 1,
        comment_id: 1,
        date_created: new Date("2029-01-22T16:28:32.615Z"),
        date_edited: new Date("2029-01-22T16:28:32.615Z")
      };

      return KarmaService.addKarma(db, newKarma).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          user_id: newKarma.user_id,
          comment_id: newKarma.comment_id,
          date_created: newKarma.date_created,
          date_edited: newKarma.date_edited,
        });
      });
    });
  });
});
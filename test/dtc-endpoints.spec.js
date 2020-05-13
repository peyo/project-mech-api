const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('DTC Endpoints', function () {
  let db

  const {
    testUsers,
    testDTC,
    testComments,
  } = helpers.makeDTCFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/dtc`, () => {
    context(`Given no dtc`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/dtc')
          .expect(200, [])
      })
    })

    context('Given there are dtc in the database', () => {
      beforeEach('insert dtc', () =>
        helpers.seedDtcTables(
          db,
          testUsers,
          testDtc,
          testComments,
        )
      )

      it('responds with 200 and all of the dtc', () => {
        const expectedArticles = testDtc.map(dtc =>
          helpers.makeExpectedDtc(
            testUsers,
            dtc,
            testComments,
          )
        )
        return supertest(app)
          .get('/api/dtc')
          .expect(200, expectedDtc)
      })
    })

    context(`Given an XSS attack DTC`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousDtc,
        expectedDtc,
      } = helpers.makeMaliciousDtc(testUser)

      beforeEach('insert malicious DTC', () => {
        return helpers.seedMaliciousDtc(
          db,
          testUser,
          maliciousDtc,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/dtc`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].dtc).to.eql(expectedDtc.dtc)
            expect(res.body[0].description).to.eql(expectedDtc.description)
          })
      })
    })
  })

  describe(`GET /api/dtc/:dtc_id`, () => {
    context(`Given no DTC`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const dtcId = 123456
        return supertest(app)
          .get(`/api/dtc/${dtcId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `DTC doesn't exist` })
      })
    })

    context('Given there are DTC in the database', () => {
      beforeEach('insert dtc', () =>
        helpers.seedDtcTables(
          db,
          testUsers,
          testDtc,
          testComments,
        )
      )

      it('responds with 200 and the specified DTC', () => {
        const dtcId = 2
        const expectedDtc = helpers.makeExpectedDtc(
          testUsers,
          testDtc[dtcId - 1],
          testComments,
        )

        return supertest(app)
          .get(`/api/dtc/${dtcId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedDtc)
      })
    })

    context(`Given an XSS attack DTC`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousDtc,
        expectedDtc,
      } = helpers.makeMaliciousDtc(testUser)

      beforeEach('insert malicious DTC', () => {
        return helpers.seedMaliciousDtc(
          db,
          testUser,
          maliciousDtc,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/dtc/${maliciousDtc.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.dtc).to.eql(expectedDtc.dtc)
            expect(res.body.description).to.eql(expectedDtc.description)
          })
      })
    })
  })

  describe(`GET /api/dtc/:dtc_id/comments`, () => {
    context(`Given no dtc`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const dtcId = 123456
        return supertest(app)
          .get(`/api/dtc/${dtcId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `DTC doesn't exist` })
      })
    })

    context('Given there are comments for article in the database', () => {
      beforeEach('insert DTC', () =>
        helpers.seedDtcTables(
          db,
          testUsers,
          testDtc,
          testComments,
        )
      )

      it('responds with 200 and the specified comments', () => {
        const dtcId = 1
        const expectedComments = helpers.makeExpectedDtcComments(
          testUsers, dtcId, testComments
        )

        return supertest(app)
          .get(`/api/dtc/${dtcId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedComments)
      })
    })
  })
})

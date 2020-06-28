const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('DTC Endpoints', function () {
  let db

  const {
    testDtc,
    testComments
  } = helpers.makeDtcFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/dtc`, () => {
    context(`Given no DTC`, () => {
      it(`Responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/dtc')
          .expect(200, [])
      })
    })
  })

  describe(`GET /api/dtc/:dtc_id`, () => {
    context(`Given no DTC`, () => {
      it(`Responds with 404`, () => {
        const dtcId = 123456
        return supertest(app)
          .get(`/api/dtc/${dtcId}`)
          .expect(404, { error: `DTC doesn't exist.` })
      })
    })

    context('Given there are DTC in the database', () => {
      beforeEach('Insert DTC', () =>
        helpers.seedDtcTables(
          db,
          testDtc,
        )
      )

      it('Responds with 200 and the specified DTC', () => {
        const dtcId = 2
        const expectedDtc = helpers.makeExpectedDtc(
          testDtc[dtcId - 1],
        )

        return supertest(app)
          .get(`/api/dtc/${dtcId}`)
          .expect(200, expectedDtc)
      })
    })
  })

  describe(`GET /api/dtc/:dtc_id/comments`, () => {
    context(`Given no DTC`, () => {
    
      it(`Responds with 404`, () => {
        const dtcId = 123456
        return supertest(app)
          .get(`/api/dtc/${dtcId}/comments`)
          .expect(404, { error: `DTC doesn't exist` })
      })
    })

    context('Given there are comments for DTC in the database', () => {
      beforeEach('Insert DTC', () =>
        helpers.seedDtcTables(
          db,
          testDtc,
        )
      )

      it('Responds with 200 and the specified comment', () => {
        const dtcId = 1
        const expectedDtc = helpers.makeExpectedDtcComments(
          dtcId, testComments, testUsers
        )

        return supertest(app)
          .get(`/api/dtc/${dtcId}/comments`)
          .expect(200, expectedDtc)
      })
    })
  })
})

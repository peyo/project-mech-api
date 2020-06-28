process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'

require('dotenv').config();
const { expect } = require("chai");
const supertest = require("supertest");
const chai = require("chai");
chai.use(require("chai-string"));

global.expect = expect;
global.supertest = supertest;
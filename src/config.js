module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "postgres://gugiaeipbbvlnf:a1f50b1fbcb167a28e8c5e662f285d4242c447b4d64578aa0dbf4accbad6896b@ec2-54-86-170-8.compute-1.amazonaws.com:5432/d64macv979a2bl",
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "Postgresql:peteryoon:pg9177@localhost/mech-test",
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
require("@babel/register");

const { before, after } = require("kocha");
const db = require("../util/db");
const mongoose = require("mongoose");

const dbUrl = process.env.MONGODB;
const isTestDatabase = () => /test-buttons-backend/.test(dbUrl);

before(done => {
  console.log(`connecting to mongodb: ${dbUrl}`);

  db.on("open", async () => {
    if (!isTestDatabase()) {
      throw new Error(`Cannot run tests against non test database: ${dbUrl}`);
    }

    done();
  });
});

after(async () => {
  console.log(`disconnecting from mongodb: ${dbUrl}`);

  if (isTestDatabase()) {
    await db.db.dropDatabase();
  }

  await db.close();
});

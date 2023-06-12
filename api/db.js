const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const { MongoClient } = require('mongodb');

let db;

const {
  DB_USER,
  DB_USER_PASSWD,
  DB_NAME,
  DB_CLUSTER,
  DB_COLLECTION_COUNTERS,
} = process.env;

async function connectToDb() {
  const url = `mongodb+srv://${DB_USER}:${DB_USER_PASSWD}@${DB_CLUSTER}/`;
  console.log(url);
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', DB_CLUSTER);
  db = client.db(DB_NAME);
}

async function getNextSequence(name) {
  const result = await db.collection(DB_COLLECTION_COUNTERS).findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getNextSequence, getDb };

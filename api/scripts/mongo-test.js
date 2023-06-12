/* eslint no-restricted-globals: "off" */
const { MongoClient } = require('mongodb');

const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');

require('dotenv').config({ path: envPath });

const {
  DB_USER,
  DB_USER_PASSWD,
  DB_NAME,
  DB_COLLECTION,
  DB_CLUSTER,
} = process.env;

const url = `mongodb+srv://${DB_USER}:${DB_USER_PASSWD}@${DB_CLUSTER}/`;

function readTestWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect((conErr) => {
    if (conErr) {
      console.error('Error connecting to MongoDB:', conErr);
      callback(conErr);
      return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(DB_COLLECTION);

    collection.find().toArray((findErr, documents) => {
      if (findErr) {
        console.error(`Error obtaining documents from "${DB_COLLECTION}" collection:`, findErr);
        callback(findErr);
        return;
      }
      console.log(`Documents from "${DB_COLLECTION}" collection:`);
      console.log(documents);
      client.close();
      callback(null);
      console.log('Connection closed');
    });
  });
}

async function readTestWithAsync() {
  console.log('\n--- testWithAwaitAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);
    const collection = db.collection(DB_COLLECTION);
    const docs = await collection.find().toArray();

    console.log('Result: ');
    docs.forEach((doc) => {
      console.log(doc);
    });
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
    console.log('Connection closed');
  }
}


readTestWithCallbacks((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Operation successfully completed.');
  }
  readTestWithAsync();
});

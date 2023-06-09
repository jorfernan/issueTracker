const { MongoClient } = require("mongodb");

require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_USER_PASSWD;
const DB_NAME = process.env.DB_NAME;
const DB_COLLECTION = process.env.DB_COLLECTION;
const DB_CLUSTER=process.env.DB_CLUSTER;

url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/`;

function readTestWithCallbacks(callback) {
  console.log("\n--- testWithCallbacks ---");
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function (err, client) {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      callback(err);
      return;
    }
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(DB_COLLECTION);

    collection.find().toArray(function (err, documents) {
      if (err) {
        console.error(`Error obtaining documents from "${DB_COLLECTION}" collection:`, err);
        callback(err);
        return;
      }
      console.log(`Documents from "${DB_COLLECTION}" collection:`);
      console.log(documents);
      client.close();
      callback(null);
      console.log("Connection closed");
    });
  });
}

async function readTestWithAsync(){

  console.log("\n--- testWithAwaitAsync ---");
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(DB_COLLECTION);
    const docs = await collection.find().toArray();

    console.log("Result: ");
    docs.forEach(doc => {
      console.log(doc);
    });
    
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
    console.log("Connection closed");
  }
}


readTestWithCallbacks( function(err) {

    if (err) {
        console.log(err);
    } else {
      console.log("Operation successfully completed.");
    }

    readTestWithAsync();
})



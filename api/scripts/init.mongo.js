const { MongoClient } = require("mongodb");

const path = require("path");

const envPath = path.resolve(__dirname, "../../.env");

require("dotenv").config({ path: envPath });

const {
  DB_USER,
  DB_USER_PASSWD,
  DB_NAME,
  DB_COLLECTION,
  DB_CLUSTER,
  DB_COLLECTION_COUNTERS,
} = process.env;

async function initializeDB() {
  const url = `mongodb+srv://${DB_USER}:${DB_USER_PASSWD}@${DB_CLUSTER}/`;

  const issuesDB = [
    {
      id: 1,
      status: "New",
      owner: "Ravan",
      effort: 5,
      created: new Date("2018-08-15"),
      due: undefined,
      title: "Error in console when clicking Add",
    },
    {
      id: 2,
      status: "Assigned",
      owner: "Eddie",
      effort: 14,
      created: new Date("2018-08-16"),
      due: new Date("2018-08-30"),
      title: "Missing bottom border on panel",
    },
    {
      id: 3,
      status: "Fixed",
      owner: "Jorge",
      effort: 18,
      created: new Date("2018-08-12"),
      due: new Date("2018-08-22"),
      title: "Database collection testing",
    },
  ];

  console.log("\n--- Initializing Mongo DB ---\n");
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();

    console.log("\n--- Connected to MongoDB ---");
    const db = client.db(DB_NAME);

    console.log(
      `\n--- Deleting all documents from "${DB_NAME}.${DB_COLLECTION}" ---`
    );
    await db.collection(DB_COLLECTION).deleteMany({});

    console.log(
      `\n--- Inserting new documents to "${DB_NAME}.${DB_COLLECTION}" ---`
    );
    await db.collection(DB_COLLECTION).insertMany(issuesDB);
    const count = await db.collection(DB_COLLECTION).countDocuments();
    console.log(`\nNumber of documents inserted: ${count}\n`);

    console.log(
      `\n--- Creating indexes in "${DB_NAME}.${DB_COLLECTION}" ---\n`
    );
    await db.collection(DB_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(DB_COLLECTION).createIndex({ status: 1 });
    await db.collection(DB_COLLECTION).createIndex({ owner: 1 });
    await db.collection(DB_COLLECTION).createIndex({ created: 1 });

    console.log(
      `\n--- Deleting ${DB_COLLECTION_COUNTERS} collection in "${DB_NAME}" ---\n`
    );
    await db.collection(DB_COLLECTION_COUNTERS).deleteOne({ _id: "issues" });

    console.log(
      `\n--- Creating ${DB_COLLECTION_COUNTERS} collection in "${DB_NAME}" for "${DB_COLLECTION}" collection" ---\n`
    );
    await db
      .collection(DB_COLLECTION_COUNTERS)
      .insertOne({ _id: "issues", current: count });

    const indexes = await db.collection(DB_COLLECTION).indexes();
    console.log(`Generated indexes:\n`);
    indexes.forEach((index) => {
      console.log(index);
    });
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
    console.log("\n--- Connection closed ---\n");
  }
}

initializeDB();

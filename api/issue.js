const { UserInputError } = require('apollo-server-express');

const path = require('path');

const { getDb, getNextSequence } = require('./db');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const {
  DB_COLLECTION,
} = process.env;

async function list() {
  const db = getDb();
  const issues = await db.collection(DB_COLLECTION).find({}).toArray();
  return issues;
  // If there are thousands of documents
  /*
  const batchSize = 1000; // Fetch 1000 documents at a time
  const cursor = db.collection(DB_COLLECTION).find({});

  const issues = [];
  let currentBatch = [];

  while (await cursor.hasNext()) {
    const document = await cursor.next();
    currentBatch.push(document);

    if (currentBatch.length === batchSize) {
      issues.push(...currentBatch);
      currentBatch = [];
    }
  }

  if (currentBatch.length > 0) {
    issues.push(...currentBatch);
  }

  return issues;
*/
}

function validate(issue) {
  // Holds error messages of failed validations
  const errors = [];
  // Add minimum length for the issue title. If fails, a message is pushed into de errors array
  if (issue.title.length < 3) {
    errors.push('Field "title" must be a least 3 characters long.');
  }
  // Add a conditional mandatory validation that checks
  // for the owner being required when the status is set to Assigned
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is requierd when status is "Assigned"');
  }
  // Use the UserInputError class to generate user errors.
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { issue }) {
  const db = getDb();
  const issueCopy = { ...issue };
  validate(issueCopy);
  issueCopy.created = new Date();

  issueCopy.id = await getNextSequence('issues');
  const result = await db.collection(DB_COLLECTION).insertOne(issueCopy);
  const savedIssue = await db.collection(DB_COLLECTION)
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

module.exports = { list, add };

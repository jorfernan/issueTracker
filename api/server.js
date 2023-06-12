const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const fs = require('fs');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const path = require('path');

let aboutMessage = 'Issue Tracker API v1.0';

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const {
  DB_USER,
  DB_USER_PASSWORD,
  DB_NAME,
  DB_COLLECTION,
  DB_CLUSTER,
  DB_COLLECTION_COUNTERS,
  SERVER_PORT_API,
} = process.env;

const url = `mongodb+srv://${DB_USER}:${DB_USER_PASSWORD}@${DB_CLUSTER}/`;
let db;

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', DB_CLUSTER);
  db = client.db(DB_NAME);
}

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',

  // Convert a Date to a String.
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    // Catch invalid date strings
    const dateValue = new Date(value);
    return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value);
      return Number.isNaN(value.getTime()) ? undefined : value;
    }
    return undefined;
  },
});

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function issueValidate(issue) {
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

async function getNextSequence(name) {
  const result = await db.collection(DB_COLLECTION_COUNTERS).findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function issueAdd(_, { issue }) {
  const issueCopy = { ...issue };
  issueValidate(issueCopy);
  issueCopy.created = new Date();

  issueCopy.id = await getNextSequence('issues');
  const result = await db.collection(DB_COLLECTION).insertOne(issueCopy);
  const savedIssue = await db.collection(DB_COLLECTION)
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

async function issueList() {
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

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,

  formatError: (error) => {
    console.log(error);
    // const { extensions: { errors }, ...rest } = error;
    // return { ...rest, extensions: { errors } };
    return error;
  },
});

const app = express();

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);

server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function start() {
  try {
    await connectToDb();
    app.listen(SERVER_PORT_API, () => {
      console.log(`API server started on port ${SERVER_PORT_API}`);
    });
  } catch (err) {
    console.log('Error: ', err);
  }
}());

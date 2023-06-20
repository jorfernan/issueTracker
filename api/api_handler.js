const fs = require('fs');

const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date');

const about = require('./about');

const issue = require('./issue');

const {
  ENABLE_CORS,
} = process.env;

const resolvers = {
  Query: {
    about: about.getMessage,
    issueList: issue.list,
    issue: issue.get,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    issueAdd: issue.add,
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

function installHandler(app) {
  const enableCors = (ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };

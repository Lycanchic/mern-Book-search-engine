const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const { authMiddleware } = require('./utils/auth');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const PORT = process.env.PORT || 3001;

const { typeDefs, resolvers } = require('./schemas');



//create a ne apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  contect: authMiddleware
})

//intergrate our apollo server with the express application middleware
server.aplyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

console.log(`API server running on port ${PORT}!`);

//log where we can go to test our GQL API
console.log('error occured: ' + err);
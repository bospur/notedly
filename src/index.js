const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require('dotenv').config();

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

db.connect(DB_HOST);

async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => {
            return { models };
        }
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, path: "/api" });

    app.listen(port, () => {
        console.log(
            `GraphQL server running at http://localhost:${port}${apolloServer.graphqlPath}`
        );
    });
}

startServer();

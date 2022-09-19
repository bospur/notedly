const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const { ApolloServer } = require("apollo-server-express");
require('dotenv').config();

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
// app.use(helmet());
// app.use(cors());

db.connect(DB_HOST);

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            new Error('Session invalid')
        }
    }
}
async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
        context: async ({ req }) => {
            const token = req.headers.authorization;
            const user = await getUser(token);
            // console.log(user);
            return { models, user };
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

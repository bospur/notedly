const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require('dotenv').config();

const db = require('./db');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
    { id: "1", content: "This is a note", author: "Adam Scott" },
    { id: "2", content: "This is another a note", author: "Mary Po" },
    { id: "3", content: "O hey look, another note", author: "Ivan Sem" },
];

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello world",
        notes: async () => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return await models.Note.findById(args.id);
        },
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Adam Scott'
            })
        },
    },
};


const app = express();

db.connect(DB_HOST);

async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, path: "/api" });

    app.get("/", (req, res) => res.send("Hello World!!!"));
    app.listen(port, () => {
        console.log(
            `GraphQL server running at http://localhost:${port}${apolloServer.graphqlPath}`
        );
    });
}

startServer();

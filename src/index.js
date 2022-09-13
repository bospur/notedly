const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const port = process.env.PORT || 4000;

let notes = [
    {id : '1', content: 'This is a note', author: 'Adam Scott'},
    {id : '2', content: 'This is another a note', author: 'Mary Po'},
    {id : '3', content: 'O hey look, another note', author: 'Ivan Sem'},
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
        note(id : ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            const noteValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'Adam Scott'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

const app = express();

async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({ app, path: '/' });
    app.get('/', (req, res) => res.send('Hello World!!!'));
    app.listen(port, () => {
        console.log(
            `GraphQL server running at http://localhost:${port}${apolloServer.graphqlPath}`
        );
    });
}

startServer();
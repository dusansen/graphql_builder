import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const { gql } = require('apollo-server');

export const typeDefs = gql`
  type Article {
    id: ID!,
    title: String,
    author: User,
    text: String,
    comments: [Comment]
  }

  type Comment {
    id: ID!,
    text: String,
    author: User
  }

  type User {
    id: ID!,
    firstName: String,
    lastName: String,
  }

  type Query {
    getArticles: [Article],
    getComments: [Comment],
  }

  type Mutation {
    addArticle(title: String!, text: String!, authorId: ID!): Article,
    addAuthor(firstName: String!, lastName: String!): User
  }
`;
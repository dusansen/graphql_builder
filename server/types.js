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
    getArticleById(id: ID!): Article,
    getComments: [Comment],
    getCommentsByUser(author: ID!): [Comment]
  }

  type Mutation {
    addArticle(title: String!, text: String!, author: ID!): Article,
    addUser(firstName: String!, lastName: String!): User
  }
`;
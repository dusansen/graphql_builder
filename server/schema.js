const { gql } = require('apollo-server');

export const typeDefs = gql`
  type Article {
    id: String,
    title: String,
    author: User,
    text: String,
    comments: [Comment]
  }

  type Comment {
    id: String,
    text: String,
    author: User
  }

  type User {
    id: String,
    firstName: String,
    lastName: String,
  }

  type Query {
    getArticles: [Article],
    getArticleById(id: Int!): Article
  }
`;
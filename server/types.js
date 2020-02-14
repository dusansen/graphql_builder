const { gql } = require('apollo-server');

export const typeDefs = gql`
  type Article {
    id: Int,
    title: String,
    author: User,
    text: String,
    comments: [Comment]
  }

  type Comment {
    id: Int,
    text: String,
    author: User
  }

  type User {
    id: Int,
    firstName: String,
    lastName: String,
  }

  type Query {
    getArticles: [Article],
    getArticleById(id: Int!): Article,
    getComments: [Comment],
    getCommentsByUser(author: Int!): [Comment]
  }
`;
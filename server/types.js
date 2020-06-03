const { gql } = require('apollo-server');

export const typeDefs = gql`
  type Article {
    _id: ID!,
    title: String,
    author: Author,
    text: String,
    comments: [Comment]
  }

  type Comment {
    _id: ID!,
    text: String,
    author: Author
  }

  type Author {
    _id: ID!,
    firstName: String,
    lastName: String,
    age: Int
  }

  type Query {
    getArticles(filter: String): [Article],
    getComments(filter: String): [Comment],
    getAuthors(filter: String): [Author]
  }

  type Mutation {
    addArticle(title: String!, text: String!, authorId: ID!): Article,
    addAuthor(firstName: String!, lastName: String!, age: Int!): Author,
    addComment(text: String!, authorId: String!, articleId: String!): Comment
  }
`;
import { getArticles, getComments, getAuthors, addAuthor, addArticle } from './database';

export const resolvers = {
  Query: {
    getArticles: getArticles,
    getComments: getComments,
    getAuthors: getAuthors
  },

  Mutation: {
    addArticle: (_, args) => addArticle(args),
    addAuthor: (_, args) => addAuthor(args)
  },

  Article: {
    author: parent => parent.author,
    comments: parent => parent.comments,
  },
  Comment: {
    author: parent => parent.author
  }
};
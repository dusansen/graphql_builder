import { getArticles, getComments, getAuthors, addAuthor, addArticle, addComment } from './database';

export const resolvers = {
  Query: {
    getArticles,
    getComments,
    getAuthors
  },

  Mutation: {
    addArticle: (_, args) => addArticle(args),
    addAuthor: (_, args) => addAuthor(args),
    addComment: (_, args) => addComment(args)
  },

  Article: {
    author: parent => parent.author,
    comments: parent => parent.comments,
  },
  Comment: {
    author: parent => parent.author
  }
};
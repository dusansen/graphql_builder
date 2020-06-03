import { getResources, addAuthor, addArticle, addComment } from './database';

export const resolvers = {
  Query: {
    getArticles: (_, args) => getResources(args, 'articles'),
    getAuthors: (_, args) => getResources(args, 'authors'),
    getComments: (_, args) => getResources(args, 'comments')
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
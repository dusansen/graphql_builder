const axios = require('axios');

export const resolvers = {
  Query: {
    getArticles: () => axios.get('http://localhost:3000/articles').then(result => result.data),
    getComments: () => axios.get('http://localhost:3000/comments').then(result => result.data),
  },

  Mutation: {
    addArticle: (parent, args) => axios.post('http://localhost:3000/articles', args).then(result => result.data),
    addAuthor: (parent, args) => axios.post('http://localhost:3000/authors', args).then(result => result.data)
  },

  Article: {
    author: parent => axios.get(`http://localhost:3000/authors/${parent.authorId}`).then(result => result.data),
    comments: parent => axios.get('http://localhost:3000/comments').then(result =>
      result.data.filter(com => com.articleId === parent.id)),
  },
  Comment: {
    author: parent => axios.get(`http://localhost:3000/authors/${parent.authorId}`).then(result => result.data)
  }
};
const axios = require('axios');

export const resolvers = {
  Query: {
    getArticles: () => axios.get('http://localhost:3000/articles').then(result => result.data),
    getArticleById: (parent, args) => axios.get(`http://localhost:3000/articles/${args.id}`).then(result => result.data),
    getComments: () => axios.get('http://localhost:3000/comments').then(result => result.data),
    getCommentsByUser: (parent, args) => axios.get('http://localhost:3000/comments').then(result => result.data.filter(com => com.author == args.author))
  },

  Mutation: {
    addArticle: (parent, args) => axios.post('http://localhost:3000/articles', args).then(result => result.data),
    addUser: (parent, args) => axios.post('http://localhost:3000/users', args).then(result => result.data)
  },

  Article: {
    author: parent => axios.get(`http://localhost:3000/users/${parent.author}`).then(result => result.data),
    comments: parent => axios.get('http://localhost:3000/comments').then(result =>
      result.data.filter(com => parent.comments && parent.comments.includes(com.id))
    )
  },
  Comment: {
    author: parent => axios.get(`http://localhost:3000/users/${parent.author}`).then(result => result.data)
  }
};
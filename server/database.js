import { ObjectId } from 'mongodb';
require('dotenv').config();
const { MongoClient } = require('mongodb');

let database;

const initDB = async () => {
  try {
    const client = new MongoClient(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    database = await client.db('gql');
  } catch {
    console.error('CONNECTION TO MONGO DATABASE FAILED!');
  }
};

export const getArticles = () => database.collection('articles')
  .aggregate(
    [
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'articleId',
          as: 'comments'
        }
      }
    ]
  ).toArray();

export const getAuthors = () => database.collection('authors').find({}).toArray();

export const getComments = () => database.collection('comments').find({}).toArray();

export const addArticle = async data => {
  try {
    const author = await database.collection('authors').findOne({ _id: new ObjectId(data.authorId) });
    const article = { ...data, author, comments: [] };
    delete article.authorId;
    const { ops } = await database.collection('articles').insertOne(article);
    return ops[0];
  } catch {
    return null;
  }
};

export const addAuthor = async data => {
  try {
    const { ops } = await database.collection('authors').insertOne(data);
    return ops[0];
  } catch {
    return null;
  }
};

initDB();
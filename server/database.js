require('dotenv').config();
const { MongoClient } = require('mongodb');
import { ObjectId } from 'mongodb';
import { convertToMongoType, mongoOperatorMapper } from './utils';

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

const createMatchObject = filter => {
  const matchArray = [];
  const filterObject = JSON.parse(filter);
  Object.entries(filterObject).forEach(([propName, { value, type, condition }]) => {
    matchArray.push({
      [propName]: { [mongoOperatorMapper(condition)]: convertToMongoType(value, type, condition) }
    })
  }, []);
  return {
    $match: {
      $and: matchArray
    }
  };
};

const getAggregateArrayForCollection = collection => {
  if (collection === 'articles') {
    return [
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'articleId',
          as: 'comments'
        }
      }
    ];
  }
  return [];
}

export const getResources = ({ filter }, collection) => {
  const aggregateArray = getAggregateArrayForCollection(collection);

  if (filter) {
    aggregateArray.push(createMatchObject(filter));
  }

  return database.collection(collection)
    .aggregate(aggregateArray).toArray();
};

export const getAuthorsByFirstName = ({ firstName }, collection) => {
  const aggregateArray = getAggregateArrayForCollection(collection);

  if (firstName) {
    const queryObject = JSON.stringify({
      firstName: {
        value: firstName,
        type: 'String',
        condition: 'contain'
      }
    });
    aggregateArray.push(createMatchObject(queryObject))
  }

  return database.collection(collection)
    .aggregate(aggregateArray).toArray();
}

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

export const addComment = async data => {
  try {
    const author = await database.collection('authors').findOne({ _id: new ObjectId(data.authorId) });
    const comment = {
      text: data.text,
      author,
      articleId: new ObjectId(data.articleId)
    }
    const { ops } = await database.collection('comments').insertOne(comment);
    return ops[0];
  } catch {
    return null;
  }
};

initDB();
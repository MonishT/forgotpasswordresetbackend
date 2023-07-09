import { ObjectId } from 'mongodb';
import DbClient from './db-client.js'
const DB_NAME = 'users';

// GET All entity name
const readAll = async (entityName) => {
  return await DbClient.db(DB_NAME).collection(entityName).find(
    {},
    {
      projection: {
        _id: 0
      }
    }).toArray();
};

// GET One user --> READ One
const findUsers = async (entityName, entityId) => {
  return await DbClient.db(DB_NAME).collection(entityName).findOne(
    {email: entityId },
    {
      projection: {
        _id: 0
      }
    }
);
}

// GET Token --> READ One
const findToken = async (entityName, entityId) => {
  return await DbClient.db(DB_NAME).collection(entityName).findOne(
    {token: entityId },
    {
      projection: {
        _id: 0
      }
    }
);
}

// create --> CREATE
const createEntity = async (entityName, entityObj) => {
  return await DbClient.db(DB_NAME).collection(entityName).insertOne(
    { ...entityObj, id: new ObjectId().toString() }
  );
}

// update user details
const updateUserEntity = async (entityName, entityId, entityObj) => {
  return await DbClient.db(DB_NAME).collection(entityName).updateOne(
    { 'id': entityId },
    { '$set': {
          "token":entityObj
      } 
    }
  );
}

// update password details of user
const updatePasswordEntity = async (entityName, entityId, entityObj) => {
  return await DbClient.db(DB_NAME).collection(entityName).updateOne(
    { 'id': entityId },
    { '$set': {
          "password":entityObj,
          "token":null
      } 
    }
  );
}




export {
  readAll,
  createEntity,
  findUsers,
  findToken,
  updateUserEntity,
  updatePasswordEntity,
}
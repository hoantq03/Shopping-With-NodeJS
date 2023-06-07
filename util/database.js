const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/shopnodejs?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db();
      console.log("connected");
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "no database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

//  CRUD operations: Create - Read - Update - Delete
// Add the following lines to mongodb.cfg
// port=27017
// dbpath=C:\data\db
// logpath=C:\data\db_logs

// mongod from the folder or
// mongod --dbpath ....

// const mongodb = require('mongodb')
// // to connect to the database
// const MongoClient = mongodb.MongoClient

// const { MongoClient } = require("mongodb");
let MongoClient = require('mongodb').MongoClient;

// define connection URL and database we are trying to connect to
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'tiny-landmarks'

console.log("Connecting to db...")
//  connect to server (connection_url, options, callback that is called when we connect to the db)
// , { useNewUrlParser: true ,useUnifiedTopology:true} deprecated options
MongoClient.connect(connectionURL, (error, client) => {

    if (error){
        return console.log('Unable to connect to database!')
    } 

    console.log("SUCCESS! Connection correctly!")
    const db = client.db(databaseName)

    db.collection('users').insertOne({
        name: 'Theo',
        age: 35 
    })

    
})















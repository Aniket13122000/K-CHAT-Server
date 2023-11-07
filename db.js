const { MongoClient } = require('mongodb')

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb+srv://userb:userbpassword@cluster0.7qdbv1x.mongodb.net/UserDB?retryWrites=true&w=majority')
      .then(client => {
        dbConnection = client.db('chat-app')
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}
import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function connect() {
  if (!mongoClient.isConnected()) await mongoClient.connect()
  const db = mongoClient.db(process.env.DATABASE_NAME)
  return { db }
}

export { connect }
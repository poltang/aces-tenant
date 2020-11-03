import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(process.env.DATABASE_NAME);
  return { db, client };
}

export { connect };
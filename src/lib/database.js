import { MongoClient } from "mongodb";

const url = "" + process.env.MONGO_URL
// const url = "mongodb+srv://adminits:Wm2CxEcgtyyWJYUQ@aces01.v36mf.mongodb.net/aces02?retryWrites=true&w=majority"

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
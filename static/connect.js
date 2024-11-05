import { MongoClient } from "mongodb";
const username = encodeURIComponent("userProbe");
const password = encodeURIComponent("qaANtuGAGx23eM10");
const cluster = "hacker-hub.vd4tq.mongodb.net";
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Hacker-Hub`;

const client = new MongoClient(uri);
async function run(user) {
  try {
    await client.connect();
    const database = client.db("Accounts");
    const ratings = database.collection("Users");
    const cursor = ratings.find();
    await cursor.forEach(doc => {
      console.dir(doc)
      console.log('---')
      alert(doc[user])
    });
  } catch {
    alert('ERROR')
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

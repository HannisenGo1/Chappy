import { MongoClient, ObjectId } from 'mongodb';
const con = process.env.CONNECTION_STRING;
async function connect() {
    if (!con) {
        console.log('No connection string, check your .env file!');
        throw new Error('No connection string');
    }
    const client = await MongoClient.connect(con);
    const db = await client.db('chappy');
    const col = db.collection('user');
    return [col, client];
}
async function getUser() {
    const [col, client] = await connect();
    const result = await col.find({}).toArray();
    await client.close();
    return result;
}
async function updateUser(id, newUser) {
    // TODO: ändra returtyp till något mera passande
    const [col, client] = await connect();
    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: newUser });
    await client.close();
    return result;
}
export { getUser, updateUser, connect };

import { MongoClient, ObjectId } from 'mongodb';
const con = process.env.CONNECTION_STRING;
// ansluter till mongodb collection 
async function connect() {
    if (!con) {
        console.log('check the .env file!');
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
// Få ut användare baserat på namn.
async function getUserByname(name) {
    const [col, client] = await connect();
    const user = await col.findOne({ name });
    await client.close();
    return user;
}
// Skapa en ny användare
async function createUser(newUser) {
    const [col, client] = await connect();
    const result = await col.insertOne(newUser);
    await client.close();
    return result;
}
// Radera befintlig användare
async function deleteUser(id) {
    const [col, client] = await connect();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    await client.close();
    return result;
}
export { getUser, connect, getUserByname, createUser, deleteUser };

import { MongoClient, Collection, WithId, Db, 
ObjectId, InsertOneResult ,DeleteResult } from 'mongodb';
import { user } from '../models/users.js'; 


const con: string | undefined = process.env.CONNECTION_STRING

// ansluter till mongodb collection 
async function connect(): Promise<[Collection<user>, MongoClient]> {
	if( !con ) {
		console.log('check the .env file!')
		throw new Error('No connection string')
	}

	const client: MongoClient = await MongoClient.connect(con)
	const db: Db = await client.db('chappy')
	const col: Collection<user> = db.collection<user>('user')
	return [col, client]
}

async function getUser(): Promise<WithId<user>[]> {
	const [col, client]: [Collection<user>, MongoClient] = await connect()

	const result: WithId<user>[] = await col.find({}).toArray()
	await client.close()
	return result
}

// Få ut användare baserat på namn, använder i validateLogin för inloggningen.
async function getUserByname(username: string): Promise<WithId<user> | null> {
    const [col, client]: [Collection<user>, MongoClient] = await connect();

    const user = await col.findOne({ username }); 
    await client.close();
    return user;
}


// Skapa en ny användare
async function createUser(newUser: user): Promise<InsertOneResult<user>> {
    const [col, client]: [Collection<user>, MongoClient] = await connect();

    const result = await col.insertOne(newUser); 
    await client.close();
    return result;
}

// Radera befintlig användare
async function deleteUser(id: string): Promise<DeleteResult> {
    const [col, client]: [Collection<user>, MongoClient] = await connect();

    const result = await col.deleteOne({ _id: new ObjectId(id) }); 
    await client.close();
    return result;
}
export {getUser, connect, getUserByname, createUser, deleteUser}
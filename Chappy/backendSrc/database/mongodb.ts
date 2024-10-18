import { MongoClient, Collection, UpdateResult, WithId, Db, ObjectId } from 'mongodb';
import { user } from '../models/users'; 


const con: string | undefined = process.env.CONNECTION_STRING

async function connect(): Promise<[Collection<user>, MongoClient]> {
	if( !con ) {
		console.log('No connection string, check your .env file!')
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

async function updateUser(id: string, newUser: user): Promise<UpdateResult<user>> {
	
	const [col, client]: [Collection<user>, MongoClient] = await connect()

	const result: UpdateResult<user> = await col.updateOne({ _id: new ObjectId(id) }, { $set: newUser })
	await client.close()
	return result
}
export {getUser, updateUser, connect}
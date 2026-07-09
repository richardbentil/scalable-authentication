// implement connection pooling for mongodb
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 30000
};

let client = null;
let clientPromise = null;

const connectDB = async () => {
    try {
        if (client) {
            return client.db();
        }

        if (!clientPromise) {
            client = new MongoClient(uri, options);
            clientPromise = client.connect();
        }

        await clientPromise;
        return client.db();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export { connectDB };
export default connectDB;
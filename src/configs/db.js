// implmenet conncection pooling for mongodb
import mongodb from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,       // Maintains up to 10 active sockets in the cache
  minPoolSize: 2,        // Keeps at least 2 sockets open at all times
  socketTimeoutMS: 30000 // Closes idle sockets after 30 seconds
};


let client = null;
let clientPromise = null;

const connectDB = async () => {
    try {
        // get cache connection from global
        // if connection already exists, return it
        if(client){
            return client.db();
        }

        // if a connection attempt is already in progress, return the promise
        if (clientPromise) {
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

export default connectDB;
import { connectDB } from '../configs/db.js';
import { getCurrentUserId } from '../utils/requestContext.js';

const getCollection = async (collectionName) => {
    const db = await connectDB();
    return db.collection(collectionName);
};

const scopeQueryToCurrentUser = (query = {}) => {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
        return query;
    }

    return {
        ...query,
        userId: currentUserId
    };
};

const findOne = async (collectionName, query = {}, options = {}) => {
    const collection = await getCollection(collectionName);
    const { includeDeleted = false } = options;
    const scopedQuery = scopeQueryToCurrentUser(query);

    const finalQuery = includeDeleted
        ? scopedQuery
        : {
            ...scopedQuery,
            $or: [
                { deleted: { $ne: true } },
                { deleted: { $exists: false } }
            ]
        };

    return collection.findOne(finalQuery);
};

const insertOne = async (collectionName, document = {}) => {
    const collection = await getCollection(collectionName);
    const currentUserId = getCurrentUserId();

    const documentToInsert = currentUserId
        ? {
            ...document,
            userId: document.userId || currentUserId
        }
        : { ...document };

    return collection.insertOne(documentToInsert);
};

const softDeleteOne = async (collectionName, query = {}, deletedBy = null) => {
    const collection = await getCollection(collectionName);
    const scopedQuery = scopeQueryToCurrentUser(query);

    return collection.updateOne(scopedQuery, {
        $set: {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: deletedBy || null
        }
    });
};

export {
    findOne,
    insertOne,
    softDeleteOne
};
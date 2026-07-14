import { AsyncLocalStorage } from 'async_hooks';

const requestStorage = new AsyncLocalStorage();

const runWithRequestContext = (context, callback) => {
    return requestStorage.run(context, callback);
};

const getRequestContext = () => {
    return requestStorage.getStore() || {};
};

const getCurrentUser = () => {
    return getRequestContext().user || null;
};

const getCurrentUserId = () => {
    return getRequestContext().user?.id || getRequestContext().userId || null;
};

const getCurrentRole = () => {
    return getRequestContext().user?.role || null;
};

export {
    runWithRequestContext,
    getRequestContext,
    getCurrentUser,
    getCurrentUserId,
    getCurrentRole
};

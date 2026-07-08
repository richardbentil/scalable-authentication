// CORS middleware
import cors from 'cors';

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent
};

// CORS middleware function
const corsMiddleware = cors(corsOptions);




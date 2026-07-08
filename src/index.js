import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

//PORT
const PORT = process.env.PORT || 5000;

// connect to database
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
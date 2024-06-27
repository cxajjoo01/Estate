import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/user_route.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js'
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB, {
      serverSelectionTimeoutMS: 30000, // Increase server selection timeout
      socketTimeoutMS: 45000 // Increase socket timeout
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

connectToMongoDB();

app.use(express.json());
app.use(cookieParser())

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing',listingRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

app.listen(7000, () => {
  console.log("Server is running on port 7000!!");
});

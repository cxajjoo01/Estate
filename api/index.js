import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/user_route.js'
import authRouter from './routes/authRoute.js'
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MongoDB)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json())  

app.listen(7000, () => {
  console.log("Server is running on port 7000!!");
});


app.get('/test', (req,res) =>{
    res.send("Welcome to my API");
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

//MIDDLEWARE CONCEPTS
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
     success: false,
     statusCode,
     message
  });
});


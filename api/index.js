import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/user_route.js'
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

app.listen(7000, () => {
  console.log("Server is running on port 7000!!");
});


app.get('/test', (req,res) =>{
    res.send("Welcome to my API");
})

app.use('/api/user', userRouter);

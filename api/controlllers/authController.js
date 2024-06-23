
import { errorHandler } from '../utils/error.js';
import User from './../models/user_models.js';
import bcryptjs from 'bcryptjs'

export const signup = async(req,res,next) => {
   const {username,email,password} = req.body
   const hashedPassword = bcryptjs.hashSync(password,12)
   const newUser = new User({username,email,password:hashedPassword})

   try {
    await newUser.save()
    res.status(201).json('User Created Successully.')

   } catch (error) {
    // res.status(500).json(error.message)
    next(error)
    // next(errorHandler(550,'error from the function'))
   }
  
}
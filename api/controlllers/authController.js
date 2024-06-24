
import { errorHandler } from '../utils/error.js';
import User from './../models/user_models.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json('User Created Successfully.');
  } catch (error) {
    console.error('Error saving user:', error); // Add logging
    next(errorHandler(500, error.message)); // Ensure correct error message
  }
};
///end Method

export const signin = async (req, res, next) => {
   const { email, password } = req.body;

   try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
         return next(errorHandler(404, 'User Not Found.'));
      }

      const match = await bcryptjs.compare(password, validUser.password); // Use async compare
      if (!match) {
         return next(errorHandler(401, 'Wrong Credentials!'));
      }

      const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
      const { password: pass, ...rest } = validUser._doc;
      res.cookie('accessToken', token, { httpOnly: true }).status(200).json({
         success: true,
         user: rest,
      });
   } catch (error) {
      next(error);
   }
};

export const google_login = async (req, res, next) => {
   try {
     const user = await User.findOne({ email: req.body.email });
     if (user) {
       const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
       const { password: pass, ...rest } = user._doc;
       res.cookie('accessToken', token, { httpOnly: true }).status(200).json({
         success: true,
         user: rest,
       });
     } else {
       const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // 16 digits password
       const hashedPassword = await bcryptjs.hash(generatedPassword, 12);
       const newUser = new User({
         username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
         email: req.body.email,
         password: hashedPassword,
         profilePic: req.body.photo,
       });
       await newUser.save();
       
       const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
       const { password: pass, ...rest } = newUser._doc;
       res.cookie('accessToken', token, { httpOnly: true }).status(200).json({
         success: true,
         user: rest,
       });
     }
   } catch (error) {
     next(error);
   }
 };
 


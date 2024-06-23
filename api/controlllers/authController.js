
import { errorHandler } from '../utils/error.js';
import User from './../models/user_models.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

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


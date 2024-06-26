import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user_models.js";
import Listing from './../models/listingModel.js';

export const test = (req, res) => {
  res.json({
    message: "Hello World"
  });
};

export const userUpdate = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedFields = {
      username: req.body.username,
      email: req.body.email,
      profilePic: req.body.profilePic,
    };

    if (req.body.password) {
      updatedFields.password = req.body.password;
    }

    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!userUpdate) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = userUpdate._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async(req,res,next) =>{

  if(req.user.id !==req.params.id) {
    return next(errorHandler(401,'You can only delete your own account!'))
  }

  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('accessToken')
    res.status(200).json('User has been deleted!') 

  } catch (error) {
    next(error)
  }
}

export const getUserListings = async(req,res,next) =>{
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({userRef: req.params.id})
      res.status(200).json(listings)
    } catch (error) {
      next(error)
    }
  } else {
    return next(errorHandler(401,'You can only view your own listings!'))
  }
}

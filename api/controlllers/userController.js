import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user_models.js";

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

    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = userUpdate._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};

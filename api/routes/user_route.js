import express from "express";
import { test, userUpdate,deleteUser,getUserListings} from "../controlllers/userController.js"; 
import { verifyToken } from '../utils/verifyUserToken.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, userUpdate); 
router.delete('/delete/:id', verifyToken, deleteUser); 
router.get('/listings/:id',verifyToken,getUserListings)

export default router;

import express from "express";
import { test, userUpdate } from "../controlllers/userController.js"; 
import { verifyToken } from '../utils/verifyUserToken.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, userUpdate); 

export default router;

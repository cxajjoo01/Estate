import express from 'express'
import { signup, signin, google_login } from '../controlllers/authController.js';

const router = express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/google',google_login)
export default router;
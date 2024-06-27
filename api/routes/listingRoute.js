import { verifyToken } from "../utils/verifyUserToken.js";
import express from 'express';
import { createListing } from "../controlllers/listingController.js";

const router = express.Router()

router.post('/create',verifyToken,createListing)

export default router;
import { verifyToken } from "../utils/verifyUserToken.js";
import express from 'express';
import { createListing,deleteListing } from "../controlllers/listingController.js";

const router = express.Router()

router.post('/create',verifyToken,createListing)
router.delete('/delete/:id', verifyToken,deleteListing)

export default router;
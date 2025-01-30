import express from "express";
import userAuth from "../middlewares/auth.js";
import { generateImage } from "../controllers/imageController.js";

const imageRouter = express.Router();

// middleware for image routes
imageRouter.use((req, res, next) => {
    console.log('Image route hit:', req.path);
    console.log('Auth header:', req.headers.token);
    next();
});

imageRouter.post("/generate-image", userAuth, generateImage);

export default imageRouter;
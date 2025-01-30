import express from "express"
import {registerUser, loginUser, userCredits, paymentStripe} from "../controllers/userController.js"
import userAuth from "../middlewares/auth.js"

const userRouter = express.Router()

// middleware specific to user routes
userRouter.use((req, res, next) => {
    console.log('User route hit:', req.path);
    console.log('Request body in user route:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

userRouter.post("/register", (req, res, next) => {
    console.log('Register route hit with body:', req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No request body received"
        });
    }
    registerUser(req, res, next);
});

userRouter.post("/login", loginUser)
userRouter.get("/credits", userAuth, userCredits)
userRouter.post("/pay-stripe", userAuth, paymentStripe)  // Changed to POST as it's creating a payment

export default userRouter
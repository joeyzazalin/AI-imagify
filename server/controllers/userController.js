import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import stripe from "stripe";
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // Debugging logs
        console.log('Request body:', req.body);

        // Validation
        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill in all fields"});
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        // Create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new userModel({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        const user = await newUser.save();

        // Generate token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
        
        // Send response
        res.status(201).json({
            success: true, 
            token, 
            user: {
                id: user._id,
                name: user.name, 
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Server error during registration",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        
        const user = await userModel.findOne({email});

        if (!user){
            return res.status(404).json({
                success: false, 
                message: 'User does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
            res.json({
                success: true, 
                token, 
                user: {
                    id: user._id,
                    name: user.name
                }
            });
        } else {
            return res.status(401).json({
                success: false, 
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Server error during login",
            error: error.message
        });
    }
};

const userCredits = async (req, res) => {
    try {
       const {userId} = req.body;
       
       const user = await userModel.findById(userId);
       
       if (!user) {
           return res.status(404).json({
               success: false, 
               message: "User not found"
           });
       }
       
       res.json({
           success: true, 
           credits: user.creditBalance, 
           user: {
               name: user.name
           }
       });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, 
            message: "Server error retrieving user credits",
            error: error.message
        });
    }
};

const stripeInstance = new stripe({
    public_id: process.env.STRIPE_PUBLIC_KEY,
    key_secret: process.env.STRIPE_SECRET_KEY,
});

const paymentStripe = async (req, res)=>{
    try {
        const {userId, planId} = req.body
        const userData = await userModel.findById(userId)
        
        if (!userData || !planId){
            return res.json({
                success: false,
                message: "User or plan not found"
            })

        }
        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

                 case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

                 case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
        
            default:
                return res.json({
                    success: false,
                    message: "Invalid plan"
                })
        }

        date = date.now();

        const transactionData = {
            userId,
            plan,
            credits,
            amount,
            date
        }

        const newTransaction = await transactionModel.create(transactionData)

       

            const options = {
                amount: amount * 100,
                currency: process.env.STRIPE_CURRENCY,
                receipt: newTransaction._id,
                automaticPaymentMethod: {
                    enabled: true,
                }
            }

             await stripeInstance.orders.create(options, (error, order)=>{
                if (error){
                    return res.json({
                        success: false,
                        message: "Error during payment",
                        error: error.message
                    });
                }
                res.json({
                    success: true,
                    order
                });
             });
            

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error during payment",
            error: error.message
        })
    }
} 

export {registerUser, loginUser, userCredits, paymentStripe};
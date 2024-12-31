import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

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
       // Consider using req.user.id from authentication middleware
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

export { registerUser, loginUser, userCredits };
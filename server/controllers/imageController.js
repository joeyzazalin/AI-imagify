import userModel from "../models/userModel.js";
import axios from "axios";
import FormData from "form-data";

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.body.userId;

        // Validate prompt
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        // Check user credits
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.creditBalance <= 0) {
            return res.status(403).json({
                success: false,
                message: "Insufficient credits",
                creditBalance: 0
            });
        }

        // Create form data for ClipDrop API
        const formData = new FormData();
        formData.append('prompt', prompt);

        // Make request to ClipDrop API
        const response = await axios({
            method: 'post',
            url: 'https://clipdrop-api.co/text-to-image/v1',
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formData.getHeaders()
            },
            data: formData,
            responseType: 'arraybuffer'
        });

        // Check if response is an error message in JSON format
        if (response.headers['content-type'].includes('application/json')) {
            const errorMessage = JSON.parse(response.data.toString());
            throw new Error(errorMessage.error || 'Error generating image');
        }

        // Convert image buffer to base64
        const base64Image = Buffer.from(response.data).toString('base64');

        // Deduct credit
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success: true,
            resultImage: `data:image/jpeg;base64,${base64Image}`,
            creditBalance: user.creditBalance
        });

    } catch (error) {
        console.error('Generate image error:', error);
        
        // Check if error is from ClipDrop API
        if (error.response?.data) {
            try {
                const errorMessage = JSON.parse(error.response.data.toString());
                return res.status(error.response.status).json({
                    success: false,
                    message: errorMessage.error || "Error generating image"
                });
            } catch (e) {
                // If error data can't be parsed as JSON
                return res.status(500).json({
                    success: false,
                    message: "Error processing image generation response"
                });
            }
        }

        res.status(500).json({
            success: false,
            message: error.message || "Error generating image"
        });
    }
};
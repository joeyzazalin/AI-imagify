import userModel from "../models/userModel.js";
import axios from "axios";
import FormData from "form-data";

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.body.userId;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

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

        const formData = new FormData();
        formData.append('prompt', prompt);

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

        // Determine the content type from the response headers
        const contentType = response.headers['content-type'];
        
        // If the response is JSON (error message)
        if (contentType.includes('application/json')) {
            const errorMessage = JSON.parse(response.data.toString());
            throw new Error(errorMessage.error || 'Error generating image');
        }

        // Convert image buffer to base64 with proper mime type
        const base64Image = Buffer.from(response.data).toString('base64');
        const imageUrl = `data:${contentType};base64,${base64Image}`;

        // Deduct credit
        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            success: true,
            resultImage: imageUrl,
            creditBalance: user.creditBalance,
            contentType: contentType
        });

    } catch (error) {
        console.error('Generate image error:', error);
        
        if (error.response?.data) {
            try {
                const errorMessage = JSON.parse(error.response.data.toString());
                return res.status(error.response.status).json({
                    success: false,
                    message: errorMessage.error || "Error generating image"
                });
            } catch (e) {
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
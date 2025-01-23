import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.token || req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authorization token provided'
            });
        }

        // Remove Bearer if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        try {
            const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
            req.body.userId = decoded.id;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;
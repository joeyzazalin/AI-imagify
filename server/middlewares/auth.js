import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next)=>{
    const {token} = req.headers;

    if(!token){
        return res.json({success: false, message: 'Not Authorized. Login Again'});
    }
    try {
        const tokenDecoder = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecoder.id){
            req.body.userId = tokenDecoder.id;
        }else{
            return res.json({success: false, message: 'Not Authorized. Login Again'});

        }
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
    }

}

export default userAuth;
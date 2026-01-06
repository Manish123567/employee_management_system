import jwt from 'jsonwebtoken';
import User from "../models/register.model.js";


const authMiddleware =  async (req, res, next) => {


    console.log('Headers:', req.headers);
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No authorization header provided' });
    }

    const token = req.headers.authorization.split(' ')[1];
    // const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(404).json({success:false,error:"Token Not Valid"})
        }

        // if (!mongoose.isValidObjectId(decoded._id)) {
        //     return res.status(400).json({ success: false, error: "Invalid user ID in token" });
        // }

        const user = await User.findById(decoded._id).select('-password')
        console.log('User Found:', user);

        if(!user){
            return res.status(404).json({success:false, error:"User not found"})
        }
        // req.admin = decoded.admin;
        // next();
req.user = user;
next();

    } catch (err) {
        console.error('Middleware Error:', err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: "Token expired" });
        }

        res.status(500).json({ success: false, error: "Server error" });
    }
};

export default authMiddleware;

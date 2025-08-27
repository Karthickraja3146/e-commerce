import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authUser;

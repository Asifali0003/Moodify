
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");


async function authUser(req,res,next){
    const token = req.cookies?.token ;

    if(!token){
        return res.status(401).json({
            message:"token not Provided"            
        })
    }


    try {
        const decoded = jwt.verify(token,
            process.env.JWT_SECRET,
        );


        const isTokenBlacklisted = await redis.get(token); 

        if(isTokenBlacklisted){
            return res.status(401).json({
            message:"Invalid token"
        })
    }

        req.user = decoded;
        next(); 

    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }

}

module.exports ={authUser}
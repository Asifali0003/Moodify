const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");




async function registerUser(req,res) {

try {
        const {username,email,password} = req.body;
    
            const isUserAlreadyExists = await userModel.findOne({
                    $or: [{ email }, { username }]
            });
    
                if(isUserAlreadyExists) {
                    return res.status(400).json({
                        message: "User already exits with this Username or email",
                        success: false
                    })
                }
          
    
    
            const user = await userModel.create({
                username,
                email,
                password,
            })
            
            const token = jwt.sign({
                id: user._id,
                username: user.username,
                role: user.role
            },process.env.JWT_SECRET,{expiresIn: "3d"});
    
            res.cookie("token",token,{
                httpOnly: true,
                secure: false,   //  its only allow to send cookie over https in true
                sameSite: "lax"
            });
    
            res.status(201).json({
                message: "User registered successfully",
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
} catch (err) {
    console.log("Register Errore",err)

    res.status(500).json({
        message: "Internal server error",
        Error: err.message
    })
}

};

async function loginUser(req,res) {
    try {
        const {email,password,username} = req.body;
    
        const user = await userModel.findOne({
            $or : [
                {email},
                {username}
            ]
        })
    
        if(!user){
            return res.status(400).json({
                message: "Invalid credentials", 
                success: false
            })
        }
    
        const isPasswordCorrect = await user.comparePassword(password);
    
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials", 
                success: false
            })
        }
    
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        },process.env.JWT_SECRET,{expiresIn: "3d"});
    
        res.cookie("token", token,{
            httpOnly: true,
            secure: false,      // its only allow to send cookie over https in true
            sameSite: "lax"
        });
    
        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role:user.role
            },
            token
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            Error: err.message
        })
        
    }

};
async function getMe(req,res){
    try {
        const user = await userModel.findById(req.user.id);
    
        if(!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
    
        res.status(200).json({
            message: "User fetched successfully",
    
            user : {
                id : user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            Error: err.message
        })
        
    }
};
        
async function logoutUser(req, res){
    try {
        const token = req.cookies.token;
    
        res.clearCookie("token");
    
        redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24);
    
    
        res.status(200).json({
            message: "User logged out successfully",
            success: true
        }) 
    } catch (err) {
    res.status(500).json({
        message: "Internal server error",
        Error: err.message
    })
    
    } 
};




module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}
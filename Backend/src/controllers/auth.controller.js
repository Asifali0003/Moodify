const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");




async function registerUser(req,res) {

    const {username,email,password} = req.body;

    const query = email ? {email} : {username};

    const isUserAlreadyExits = await userModel.findOne(query);

            if(isUserAlreadyExits) {
                return res.status(400).json({
                    message: "User already exits with this Username or email",
                    success: false
                })
            }
      

        // const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password
        })
        
        const token = jwt.sign({
            id: user._id,
            username: user.username
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
                email: user.email
            }
        })

};

async function loginUser(req,res) {
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
        username: user.username
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
            email: user.email
        }
    })

};
async function getMe(req,res){
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
            createdAt: user.createdAt
        }
    })
};
        
async function logoutUser(req, res){
    const token = req.cookies.token;

    res.clearCookie("token");

    redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24);


    res.status(200).json({
        message: "User logged out successfully",
        success: true
    })  
};




module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}
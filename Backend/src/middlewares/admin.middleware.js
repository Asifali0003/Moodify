
async function isAdmin (req, res, next) {
    console.log("ADMIN CHECK TRIGGERED");
    const user = req.user;

    if(!user || user.role !== "admin") {
        return res.status(403).json({
            message: "You are not an admin"
        });
    }

    next();
};


module.exports = isAdmin;
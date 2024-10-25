
const onlyAdminAccess = async(req, res, next) => {
    try {
        // console.log(req.user)
        if(req.user.role != 1) {
            return res.status(404).json({
                success: false,
                message: "You haven't permissions to access this route",
            })
        }
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }

    return next();
}

module.exports = { onlyAdminAccess }
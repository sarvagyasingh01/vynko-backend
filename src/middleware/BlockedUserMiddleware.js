import { Users } from "../models/index.js";

const BlockUserMiddleware=async(req,res,next)=>{
    const username = req?.auth?.username;
    try{
        const user=await Users.findOne({
           username
        });

        if(user?.user_status===false && user?.isDeleted===false){
            return res.status(403).json({
                message: "Your account has been blocked",
                logout: true
            });

        }

        next();


    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error." });
    }
};


export {BlockUserMiddleware}
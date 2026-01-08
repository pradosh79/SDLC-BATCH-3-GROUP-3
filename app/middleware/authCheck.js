
const jwt=require('jsonwebtoken')


const AuthCheck=async(req,res,next)=>{
    const token= req?.body?.token||req?.query?.token||req?.headers['authorization']||req?.headers['x-access-token']
    if(!token){
        return res.status(401).json({message:"Access denied. No token provided"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded

    }catch(error){
        return res.status(400).json({message:"Invalid token"})
    }
    return next();
}

module.exports=AuthCheck
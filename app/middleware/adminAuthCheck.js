const jwt=require('jsonwebtoken')



const AuthCheckAdmin=(req,res,next)=>{
    if(req.cookies && req.cookies.adminToken){

        jwt.verify(req.cookies.adminToken,process.env.JWT_SECRET_ADMIN,(err,user)=>{
            req.admin=user
            console.log('auth', req.admin);
            
            next()
        })

    }else{
        return res.redirect('/admin')
    }


}


module.exports=AuthCheckAdmin
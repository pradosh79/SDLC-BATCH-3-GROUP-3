const jwt=require('jsonwebtoken')



const AuthCheckEjs=(req,res,next)=>{
    if(req.cookies && req.cookies.userToken){

        jwt.verify(req.cookies.userToken,process.env.JWT_SECRET,(err,user)=>{
            req.user=user
            console.log('auth', req.user);
            
            next()
        })

    }else{
        return res.redirect('/user/login')
    }


}


module.exports=AuthCheckEjs
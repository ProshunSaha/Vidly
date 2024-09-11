module.exports=function(req,res,next){
    // req.user is set by the previous middleware function auth.js so we can access it
    //401 Unauthorized no jwt
    //403 Forbidden jwt wrong
    if(!req.user.isAdmin) return res.status(403).send('Access Denied')
    
    next()
}
const jwt=require('jsonwebtoken')
const config=require('config')

module.exports=function auth(req, res, next){
    const token=req.header('x-auth-token');
    if(!token)
        return res.status(401).send('Access denied. No token provided')

    try{
    const decoded=jwt.verify(token,config.get('jwtPrivateKey'))
    req.user=decoded;
    // we can access req.user._id 
    next(); //pass control to the next middleware function in our resource processing pipeline
}
    catch(ex){
        res.status(400).send('Invalid token')
    }
}

//module.exports=auth;
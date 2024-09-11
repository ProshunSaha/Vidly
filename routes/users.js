const {User, validate}=require('../models/user')
const mongoose=require('mongoose')
const express=require('express')
const router=express.Router();
const _=require('lodash')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const config=require('config')
const auth=require('../middleware/auth')





//method for getting the list of all the users available in a list
router.post('/',async (req,res)=>{
    const {error}=validate(req.body)
    if (error) {
        const errorMessage=error.details.map(err=>err.message)
        return res.status(400).send(`Bad Request: ${errorMessage}`)}
    
        let user=await User.findOne({email:req.body.email}) //send a query object to check
        if(user) return res.status(400).send('User already registered')

    
    
    
    
    user=new User(_.pick(req.body,['name','email','password']))

    const salt= await bcrypt.genSalt(10)
    user.password=await bcrypt.hash(user.password,salt)

    await user.save()

    
    const token=user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id','name','email']))
})
    

router.get('/me',auth,async(req,res)=>{
    const user=await User.findById(req.user._id).select('-password')
    res.send(user)
})

module.exports=router;

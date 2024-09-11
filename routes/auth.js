const Joi=require('joi')
const {User}=require('../models/user')
const mongoose=require('mongoose')
const express=require('express')
const router=express.Router();
const _=require('lodash')
const bcrypt=require('bcrypt')





//method for getting the list of all the genres available in a list
router.post('/',async (req,res)=>{
    const {error}=validate(req.body)
    if (error) {
        const errorMessage=error.details.map(err=>err.message)
        return res.status(400).send(`Bad Request: ${errorMessage}`)}
    
    let user=await User.findOne({email:req.body.email}) //send a query object to check
    if(!user) return res.status(400).send('Invalid email or password')

    
    
   const validPassword=await bcrypt.compare(req.body.password,user.password) 
   if(!validPassword) return res.status(400).send('Invalid email or password')
 
   
    const token=user.generateAuthToken();
   
    res.send(token)
    

    
})
    
function validate(req){
    const schema=Joi.object({
        
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(255).required()
    })
    return schema.validate(req)
}

module.exports=router;

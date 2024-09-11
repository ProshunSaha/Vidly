const {Genre, validate}=require('../models/genre')
const mongoose=require('mongoose')
const express=require('express')
const router=express.Router();
const Joi=require('joi');
const auth=require ('../middleware/auth')
const admin=require ('../middleware/admin')





//method for getting the list of all the genres available in a list
router.get('/',async (req,res)=>{
    try{
        const genres= await Genre.find().sort('name')
        
    res.send(genres)
}
    catch(err){
    console.log(console.log(err.message))
    }})
    

//method for a genre with a specific id

router.get('/:id',async(req, res)=>{
    let genre=await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send("Id does not exist")
    res.send(genre) //if found
})

//method to add a new genre in the list

router.post('/',auth,async (req,res)=>{

    const token=req.header('x-auth-token')
    res.status(401)

    //have to validate if the genre is valid
    const {error}=validate(req.body)
    if (error) {
        const errorMessage=error.details.map(err=>err.message)
        return res.status(400).send(`Bad Request: ${errorMessage}`)}
    
    let genre=new Genre({
        name: req.body.name
    })

    await genre.save()
    res.send(genre)
})

router.put('/:id',async(req, res)=>{

    const {error}=validate(req.body)
    if (error) {
    const errorMessage=error.details.map(err=>err.message)
    return res.status(400).send(`Bad Request: ${errorMessage}`)
}

    const genre=await Genre.findByIdAndUpdate(req.params.id, {
        name:req.body.name
    },{new: true})


if(!genre) return res.status(404).send("Id does not exist")
res.send(genre)

})

router.delete('/:id',[auth,admin],async (req,res)=>{
    const genre=await Genre.findByIdAndDelete(req.params.id)
    if(!genre) return res.status(404).send("Id does not exist")

    //delete
    
    res.send(genre)

    
})



module.exports=router;
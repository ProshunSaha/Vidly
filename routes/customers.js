const {Customer, validate}=require('../models/customer')
const mongoose=require('mongoose')
const express=require('express')
const router=express.Router();


//method for getting the list of all the customers available in a list
router.get('/',async (req,res)=>{
    try{
        const customers= await Customer.find().sort('name')
        console.log(customers)
    res.send(customers)
}
    catch(err){
    console.log(console.log(err.message))
    }})
    

//method for a customer with a specific id

router.get('/:id',async(req, res)=>{
    let customers=await Customer.findById(req.params.id)
    if(!customers) return res.status(404).send("Id does not exist")
    res.send(customers) //if found
})

//method to add a new customer in the list

router.post('/',async (req,res)=>{
    //have to validate if the customer is valid
    const {error}=validate(req.body)
    if (error) {
        const errorMessage=error.details.map(err=>err.message)
        return res.status(400).send(`Bad Request: ${errorMessage}`)}
    
    let customer=new Customer({
        isGold:req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })

    await customer.save()
    res.send(customer)
})

router.put('/:id',async(req, res)=>{

    const {error}=validate(req.body)
    if (error) {
    const errorMessage=error.details.map(err=>err.message)
    return res.status(400).send(`Bad Request: ${errorMessage}`)
}

    const customer=await Customer.findByIdAndUpdate(req.params.id, {
        
        isGold:req.body.isGold,
        name: req.body.name,
        phone: req.body.phone

    },{new: true})


if(!customer) return res.status(404).send("Id does not exist")
res.send(customer)

})

router.delete('/:id',async (req,res)=>{
    const customer=await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(404).send("Id does not exist")

    //delete
    
    res.send(customer)

    
})


module.exports=router;
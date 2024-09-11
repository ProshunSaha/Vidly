const {Rental, validate}=require('../models/rental')
const {Movie}=require('../models/movie')
const{Customer}=require('../models/customer')
const mongoose=require('mongoose')
const express=require('express')
const router=express.Router()




//method for getting the list of all the rentals available in a list
router.get('/',async (req,res)=>{
    try{
        const rentals= await Rental.find().sort('name')
        console.log(rentals)
    res.send(rentals)
}
    catch(err){
    console.log(console.log(err.message))
    }})
    

//method for a rental with a specific id

router.get('/:id',async(req, res)=>{
    let rental=await Rental.findById(req.params.id)
    if(!rental) return res.status(404).send("rental id does not exist")
    res.send(rental) //if found
})

//method to add a new rental in the list

router.post('/',async (req,res)=>{
    //have to validate if the customer is valid
    const {error}=validate(req.body)
    if (error) {
        const errorMessage=error.details.map(err=>err.message)
        return res.status(400).send(`Bad Request: ${errorMessage}`)}
    

    
    try{
        //check if the customer id is valid
    const customer=await Customer.findById(req.body.customerId)
    if(!customer) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send('Invalid customer')
    }
  

    //check if the movie id is valid
    const movie=await Movie.findById(req.body.movieId)
    if(!movie) {
        
        return res.status(400).send('Invalid movie')
    }

    let rental=new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }, 
        
        
    })

    

    movie.numberInStock--;
    await movie.save()

   

    res.send(rental)
    }
    catch(error){
        console.error('Error processing rental:', error); // Log the error
        //if an error occured, abort the transaction and end the session
        
        return res.status(500).send('Something went wrong')
    }
    
    // rental=await rental.save()
    // movie.numberInStock--;
    // await movie.save()
   
   

    
    
})


router.delete('/:id',async (req,res)=>{
    const rental=await Rental.findByIdAndDelete(req.params.id)
    if(!rental) return res.status(404).send("Id does not exist")

    //delete
    
    res.send(rental)

    
})


module.exports=router;

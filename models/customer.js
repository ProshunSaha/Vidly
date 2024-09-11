const Joi=require('joi');
const mongoose=require('mongoose')

const Customer= mongoose.model('Customer',new mongoose.Schema({
    isGold:{
     type:Boolean, default:false
    },
    name:{
     type:String,
     required:true,
     minlength:5,
     maxlength:50
    },
    phone:{
     type: String,
     required: true,
     match: /^\d{10}$/
    }
 
     
 }))
 
 //function to validate customer
function validateCustomer(customer){
    const schema=Joi.object({
        isGold:Joi.boolean(),
        name: Joi.string().min(3).max(30).required(),
        phone:Joi.string().min(10).max(10).required()
    })
    return schema.validate(customer)
}

exports.Customer=Customer;
exports.validate = validateCustomer;
const debug=require('debug')('app:startup')
const express=require('express')
const app=express();
const helmet=require('helmet')
const morgan=require('morgan')
const config=require('config')
const mongoose=require('mongoose')
const Joi=require('joi')
Joi.objectId=require('joi-objectid')(Joi)

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}

//mongoose

mongoose.connect('mongodb://localhost/vidly')
.then(()=>debug("Connected to MongoDb.."))
.catch((err)=>debug('Error connecting to MongoDB!!!!'))


//can also use app.get('env')==='development
if(process.env.NODE_ENV==='development'){
    app.use(morgan('tiny'))
    debug('Using morgan....')
}

//the routes
const genres=require('./routes/genres')
const home=require('./routes/home')
const customers=require('./routes/customers')
const movies=require('./routes/movies')
const rentals=require('./routes/rentals')
const users=require('./routes/users')
const auth=require('./routes/auth')


//using my own middleware
const logger=require('./middleware/logger')




app.use(express.json()) //parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true}))
app.use(helmet())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(logger)
app.use('/api/genres',genres)
app.use('/',home)
app.use('/api/customers',customers)
app.use('/api/movies',movies)
app.use('/api/rentals',rentals)
app.use('/api/users',users)
app.use('/api/auth',auth)


console.log(`Application name: ${config.get('name')}`)
console.log(`Mail Server name: ${config.get('mail.host')}`)
console.log(`Password : ${config.get('mail.password')}`)
//make an array with a list of genres


// Set the port
//const port = process.env.PORT || 3000; //can use this one too
app.set('port', 3000);

// Start the server and listen on the specified port
const port = app.get('port');
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



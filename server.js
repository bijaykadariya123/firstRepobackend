
/////////////////////////////////////////////////////////////////////////// IMPORT OUR DEPENDENCIES

//read our .env file and create environmental variables
require("dotenv").config()
//pull port from .env, give default value
// const PORT = process.env.PORT
const {PORT = 4444, DATABASE_URL} = process.env
/////////////////////////////////////////////////////////////////////////////    Import express:
    const express = require("express")

/////////////////////////////////////////////////////////////////////////////    create application object:
    const app = express()

///////////////////////////////////////////////////////////////////////////      Import Mongoose
const mongoose = require("mongoose")

/////////////////////////////////////////////////////////////////////////////   Import cors
const cors = require("cors")

///////////////////////////////////////////////////////////////////////////     Import Morgan
const morgan = require("morgan")

///////////////////////////////////////////////////////////////////////////     DataBase Connection
// Establish connection:
mongoose.connect(DATABASE_URL)

//Connection Events:
mongoose.connection
.on("open", ()=>console.log("You are Connected to Mongoose"))
.on("close", ()=>console.log("You are DISconnected to Mongoose"))
.on("error", (error)=>console.log(error))

///////////////////////////////////////////////////////////////////////////      Models
// models = PascalCase, singular "People"
// collections, tables = snake_case, plural "peoples"
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})
const People = mongoose.model("People", peopleSchema)

/////////////////////////////////////////////////////////////////////////////   MiddleWare:
// cors for preventing cors errors (allows all requests from other origins )
app.use(cors())

// Morgan for logging requests
app.use(morgan("dev"))

//express functionality to recognize incoming request objects as JSON objects
app.use(express.json())



///////////////////////////////////////////////////////////////////////////     Routes
    // create a test route

// "/people"
// INDUCES - INDEX, *NEW*


/////////////////////////////////////////////////////////////////////////////   INDEX
// INDEX-get- / people - gets all people

app.get("/people", async(req, res)=>{
    try{
        //fetch all people from database
        const people = await People.find({})
        // send json of all people
        res.json(people)

    }
    catch (error){
        // send error as JSON
        res.status(400).json({error})
    }
})

// CREATE - POST - /people - create a new people
app.post("/people", async(req, res)=>{
    try{
        // Create the new person
        const person = await People.create(req.body)
        //send newly created person as JSON
        res.json(person)
    }
    catch (error){
        // send error as JSON
        res.status(400).json({error})
    }
})

// SHOW-GET- /people/:id - get a single person
app.get("/people/:id", async (req,res)=>{
    try{
        // get a person from the database
        const person= await People.findById(req.params.id)
        res.json(person)
    }
    catch(error){
        // send error as JSON
        res.status(400).json({error})
    }
})

// UPDATE - PUT - /people/:id - update a single person
app.put("/people/:id", async(req, res)=>{
    try{
        // update the person
        const person = await People.findByIdAndUpdate(req.params.id, req.body,{new:true})
        res.json(person)
    }
    catch(error){
        // send error as JSON
        res.status(400).json({error})
    }
})
// DESTROY - DELETE - /people/:id - delete a single person
app.delete("/people/:id", async (req, res) => {
    try {
        // delete the person
        const person = await People.findByIdAndDelete(req.params.id)
        // send deleted person as json
        res.status(204).json(person)
    } catch(error){
        res.status(400).json({error})
    }
})

    app.get("/", (req, res)=>{
        res.json({hello: "world"})
    })








    ///////////////////////////////////////////////////////////////////////////*****Listener */
    app.listen(PORT, ()=>{
        console.log(`Listening to Port ${PORT}`);
    })
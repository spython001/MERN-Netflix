const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');

dotenv.config();


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {console.error(err);});

//MIDDLEWARES
app.use(express.json());


//routes
app.use("/api/auth", authRoute);


app.listen(8800, ()=>{
    console.log('Backend Server is running!');
});
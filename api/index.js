const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const cors = require("cors");


/*const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // enable set cookie
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
app.use(cors('*', corsOptions));*/
app.use(cors());
// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
  });  

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
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);


app.listen(8800, ()=>{
    console.log('Backend Server is running!');
});
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async(req,res)=>{
    //CREATING HASHED PASSWORD WITH BCRYPT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async(req,res) =>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(401).json('Wrong email or password');

        //VALIDATING PASSWORD FOR UNIQUE USER
        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong email or password");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },  process.env.JWT_SEC,
            { expiresIn: "5d" }
        );

        const {password, ...info} = user._doc;

        res.status(201).json({ ...info, accessToken });
    }catch(err){
        res.status(500).json(err);
    }
    
})

module.exports = router;
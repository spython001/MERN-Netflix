const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");



//CREATE NEW LIST
router.post("/", verify, async (req,res)=>{
    if(req.user.isAdmin) {
        const newLIst = new List(req.body)
        try {
            const savedList= await newLIst.save();

            res.status(201).json(savedList);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!")
    }
});

//UPDATE Lists
router.put("/:id", verify, async (req, res)=>{
    if( req.user.isAdmin ){
        try {
            const updatedList = await List.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            res.status(200).json(updatedList);
        } catch (err) {
            res.status(500).json(err);
        }
    }else { 
        res.status(403).json("You can only update your account");
    }
});

//DELETE List
router.delete("/:id", verify, async (req, res)=>{
    if( req.user.isAdmin ){
        try {
            await List.findByIdAndDelete(req.params.id);

            res.status(200).json("The List has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    }else { 
        res.status(403).json("You can only update your account");
    }
});

//GET A List {random}
router.get("/", verify, async (req, res)=>{
        const typeQuery = req.query.type;
        const genreQuery = req.query.genre;
        let list = [];
        try {
            if(typeQuery){
                if(genreQuery){
                    list = await List.aggregate([
                        { $sample: { size: 10 }},
                        {$match:{type:typeQuery, genre:genreQuery}}
                    ]);
                } else{
                    list = await List.aggregate([
                        { $sample: { size: 10 }},
                        {$match:{type:typeQuery}}
                    ])
                }

            }else {
                list = await List.aggregate([{
                    $sample: { size: 10 }
                }]);
            }
            
            res.status(200).json(list);
        } catch (err) {
            res.status(500).json(err);
        }
});

//GET A RANDOM List
router.get("/random/", verify, async (req, res)=>{
    const type = req.query.type;
    let List;
    try {
        if(type=== "series"){
            List = await List.aggregate([
                {$match: {isSeries: true}},
                { $sample:{size:1} },
            ]);
        } else {
            List = await List.aggregate([
                {$match: {isSeries: false}},
                { $sample:{size:1} },
            ]);
        }
        
        res.status(200).json(List);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL ListS
router.get("/", verify, async (req, res)=>{
    if( req.user.isAdmin ){
        try {
            const Lists = await List.find();

            res.status(200).json(Lists.reverse()); //Using the 'reverse' function to get the latest entry or Lists
        } catch (err) {
            res.status(500).json(err);
        }
    }else { 
        res.status(403).json("You are not allowed!");
    }
});


module.exports = router;


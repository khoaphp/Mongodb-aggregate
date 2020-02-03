var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.set(express.static("public"));

app.listen(3000); // 

// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://khoapham:hozEE9LGoRHwKUQY@cluster0-qah5q.mongodb.net/OnTapMongo?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(!err){
        console.log("Mongo connected sucessfully!");
    }else{
        console.log("Mongo error");
    }
});

const Cap1 = require("./Models/Cap1");
const Cap2 = require("./Models/Cap2");

app.get("/cap1/:name", function(req, res){

    var cap1 = new Cap1({
        name:req.params.name,
        kids: []
    });

    cap1.save(function(err){
        if(err){
            res.json({kq:0});
        }else{
            res.json({kq:1});
        }
    });

});

app.get("/cap2/:idMe/:name", function(req, res){
    var cap2 = new Cap2({
        name:req.params.name
    });
    
    cap2.save(function(err){
        if(err){
            res.json({kq:0, ErrMsg:err});
        }else{
            
            Cap1.findOneAndUpdate({_id:req.params.idMe}, {$push:{kids:cap2._id}}, function(err){
                if(err){
                    res.json({kq:0, ErrMsg:err});
                }else{
                    res.json({kq:1});
                }
            });

        }
    });

});

app.get("/menu", function(req, res){
    var cap1 = Cap1.aggregate([{
        $lookup: {
            from: "cap2",
            localField: "kids",
            foreignField: "_id",
            as:"Con"
        }
    }], function(err, data){
        if(err){
            res.json({kq:0, ErrMsg:err});
        }else{
            res.json(data);
        }
    });
});

app.get("/", function(req, res){
    res.send("okay");
});
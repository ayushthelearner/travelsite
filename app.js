const express = require("express");
const app = express();
const mongoose = require('mongoose');
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

main().then(()=>{
    console.log("connected to db");
}).catch(err=> console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine","ejs"),
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(8080,()=>{
    console.log("server is started");
})

app.get("/",(req,res)=>{
    res.send("working");
})

// app.get("/testlisting",async(req,res)=>{
//     let samplelisting = new listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     })

//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("succesfull");
// });

// index route

app.get("/listings",async(req,res)=>{
    const alllisting = await listing.find({});
    res.render("./listings/index.ejs",{alllisting});
})

// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

// show route

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    res.render("listings/show.ejs",{listings});
});

// create route

app.post("/listings",wrapAsync(async(req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    
        const newlisting = new listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
    })
);

// edit route

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
})

// update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})

// delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedlist = await listing.findByIdAndDelete(id);
    console.log(deletedlist);
    res.redirect("/listings");
})

// error handling
app.use((err,req,res,next)=>{
    res.send("some error occured");
})

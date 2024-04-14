const express=require("express");
const router=express.Router();
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const multer=require('multer');
// const {storage}=require("../cloudConfig.js");
// const upload = multer({storage});

const validateListing=(req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  
  if(error){
    let errMsg=error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}


router.route("/")

//Index Route
router.get("/", async (req, res) => {
    try{
      const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    }
    catch(err){
      next(err);
     }
    
  });
  
  //New Route
  router.get("/new",isLoggedIn, (req, res) => {
    console.log(req.user);
    
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", async (req, res) => {
    try{
      let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested does not exist!");
      req.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
    }
    catch(err){
      next(err);
     }
    
  });
  
  //Create Route
  router.post("/",isLoggedIn,validateListing, 
  async (req, res,next) => {
    try{
    
      const newListing= new Listing(req.body.listing);
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing Created!!");
      res.redirect("/listings");
    }
   catch(err){
    next(err);
   }
      
    }
   
    
    
  );
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn,async (req, res) => {
    try{
      let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested does not exist!");
      req.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
    }
    catch(err){
      next(err);
     }
    
  });
  
  //Update Route
  router.put("/:id",isLoggedIn, validateListing,async (req, res) => {
    try{
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success","Listing Updated")
      res.redirect(`/listings/${id}`);
    }
    catch(err){
      next(err);
     }
   
  });
  
  //Delete Route
  router.delete("/:id",isLoggedIn, async (req, res) => {
    try{
      let { id } = req.params; //Extraction of IDS
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success","Listing Deleted!!");
      res.redirect("/listings");
    }
    catch(err){
      next(err);
    }
   
  });

  module.exports=router;
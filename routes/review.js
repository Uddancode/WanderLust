const express=require("express");
const router=express.Router();
const ExpressError= require("../utils/ExpressError.js");

const  Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview} =require("../middleware.js");

// //MiddleWear Schema Validation
// const validateReview=(req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body);
    
//     if(error){
//       let errMsg=error.details.map((el)=> el.message).join(",");
//       throw new ExpressError(400,errMsg);
//     }
//     else{
//       next();
//     }
//   }

//Reveiws POST Route
router.post("/", validateReview,async(req,res) => {
    try{
      let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
  

    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created !!");
    res.redirect(`/listings/${listing._id}`);
  
    }
    catch(err){
      next(err);
    }
   
  });
  
  //Delete Review Route
  router.delete("/:reviewId", async(req,res) =>{
    try{
      let {id, reviewId}=req.params;
      await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);
    }
    catch(err){
      next(err);
    }
  });

  module.export=router;
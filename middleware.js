const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next) => {
   if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be LoggedIn to create listing!!");
        return res.redirect("/login ");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner= async(req,res,next) =>{
  let{id}=req.params;
  let listing=await listingSchema.findById(id);

}


module.exports.validateReview=(req,res,next) =>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};
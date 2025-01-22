const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review = require('./Reviews.js');

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    category: [{
        type: String,
        enum: [
            "trending", 
            "rooms", 
            "iconic", 
            "mountains", 
            "castles", 
            "amazing", 
            "camping", 
            "farms", 
            "arctic"
        ]
    }]
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    console.log("post query");
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing; 
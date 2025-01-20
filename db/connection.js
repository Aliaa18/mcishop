import mongoose from "mongoose";
export const connectToDb = () =>{
    mongoose.connect(process.env.URI_ONLINE)
    .then(()=>console.log(`db connected on URI ${process.env.URI_ONLINE}...`));
    
}
import mongoose from "mongoose";
export const connectToDb = () =>{
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourLocalDB';
    mongoose.connect(mongoURI)
    .then(()=>console.log(`db connected on URI ${mongoURI}...`));
    
}
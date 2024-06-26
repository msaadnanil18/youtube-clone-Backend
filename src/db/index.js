import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log(` /n mongodb connect !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongoDB connection error", error)
        process.exit(1)
    }
}



export const mongooseMiddleware = (req, res, next) => {
  req.db = mongoose.models;
  next();
};

export default connectDB;
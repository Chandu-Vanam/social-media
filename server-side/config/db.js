
//folder --> config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL, 
        {useNewUrlParser: true},{useUnifiedTopology: true})
    .then(()=> console.log('mongodb database is connected successfully'))
    .catch((err)=> {
        console.log('error occured connecting to database',err.message)
        process.exit(1);
    })
}



export default connectDB;




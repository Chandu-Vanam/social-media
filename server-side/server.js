import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from "morgan";
import connectDB from './config/db.js';
import { router as userRoute } from "./routes/users.js";
import { router as authRoute } from "./routes/auth.js";
import { router as postRoute } from "./routes/posts.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//we start the express 
const app = express();

app.use(cors());

//the below statement is for getting values from env file
dotenv.config();

//we call the function and connect the database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'public/images')))
//if you use this /images dont make a req just go to that path

//middlware - it is a body parser
app.use(express.json())
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        cb(null, 'public/images');
    },
    filename: (req,file,cb) =>{
        cb(null,req.body.name)
    }
})

const upload = multer({storage});
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        return res.status(200).json('File uploaded successfully');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file' });
    }
});


//we listen the express server at this port

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, ()=> {
    console.log('Server is running successfully')
})





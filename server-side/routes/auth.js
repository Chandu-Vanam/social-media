import express from 'express'
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//register user
router.post('/register', async (req,res)=>{
    try{
        const newUser = new User(req.body);

          // Check if the user already exists
          const existingUser = await User.findOne({ email: newUser.email });

          if (existingUser) {
              return res.status(400).json('User already exists');
          }
  
          // Hash the password
          if(newUser.password){
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(newUser.password, salt);
          }

        await newUser.save();

        return res.status(201).json('user registered successfully')
    }catch(err){
        console.log('error registering user');
        res.status(500).json('Internal server error')
    }
})

//Login
router.post('/login',async (req,res)=>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({error: "user not found"});
        }

        const validpassword = await bcrypt.compare(password, user.password);
        if(!validpassword){
            return res.status(400).json({error: 'wrong password'});
        }

        res.status(200).json(user);
    }
    catch(err)
    {
        console.log('error occured while login',err)
        res.status(500).json(err);
    }
})

export {router};
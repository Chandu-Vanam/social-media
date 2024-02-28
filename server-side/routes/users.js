import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
const router = express.Router();

//update user
router.put('/:id', async (req, res) => {

    if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
        return res.status(403).json('You can update only your account or you must be an admin');
    }
    try {
        // Hash the password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        // Find the user by ID and delete the fields provided in the request body
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json('User not found');
        }

        // Return a success message along with the deleted user
        return res.status(200).json({ message: 'Account has been updated'});
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json('Internal Server Error');
    }
});

//delete user
router.delete('/:id', async (req, res) => {

    if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
        return res.status(403).json('You can delete only your account or you must be an admin');
    }
    try {
        // Find the user by ID and delete the fields provided in the request body
        const updatedUser = await User.findByIdAndDelete(req.params.id);

        if (!updatedUser) {
            return res.status(404).json('User not found');
        }

        // Return a success message along with the deleted user
        return res.status(200).json({ message: 'Account has been deleted'});
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json('Internal Server Error');
    }
});
//get a user
router.get('/', async (req,res)=>{
    //create query - to use both of them
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username:username});
        const { password, updatedAt, ...other } = user._doc;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({message:'user found', user})
    }catch(err){
        res.status(500).json({message:'error occured',error: err});
    }
})

//get friends
router.get('/friends/:userId', async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map(friend => {
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        })
        res.status(200).json(friendList)
    }catch(err){
        res.status(500).json(err)
    }
})
//follow user
router.put("/:id/follow", async (req,res)=> {
    if(req.body.userId !== req.params.id)
    {
        try{
            //current user wants to follow the followuser
            const followuser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!followuser.followers.includes(req.body.userId)){
                await followuser.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json({message: 'user has been followed'})
            }else{
                res.status(403).json({message:'you already follow this user'})
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json({message:'you cant follow yourself'})
    }
})
//unfollow user
router.put("/:id/unfollow", async (req,res)=> {
    if(req.body.userId !== req.params.id)
    {
        try{
            const followinguser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(followinguser.following.includes(req.body.userId)){
                await followinguser.updateOne({$pull: {following: req.body.userId}});
                await currentUser.updateOne({$pull: {followers: req.params.id}});
                res.status(200).json({message: 'user has been unfollowed'})
            }else{
                res.status(403).json({message:'you dont follow this user'})
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json({message:'you cant unfollow yourself'})
    }
})
export {router};
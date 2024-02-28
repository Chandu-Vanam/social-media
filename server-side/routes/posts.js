import express from "express";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

const router = express.Router();

//create a post
router.post('/', async (req,res)=> {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json({message: "successfully created post",savedPost})
    }catch(err){
        res.status(500).json(err);
    }
})

//update a post
// When you use Object.assign() to update the post object with values from the request body, it will only update the fields that are present in the request body, leaving the other fields unchanged. 
router.put('/:id', async (req,res)=> {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            Object.assign(post, req.body);
            await post.save();
    
            res.status(200).json({message:"updated post successfully"})
        }else{
            res.status(403).json({message:"you can update only your post"})
        }
    }catch(err){
        res.status(500).json({message:"error occured while updating psot",err})
    }
})
//delete a post
router.delete('/:id', async (req,res)=> {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
    
            res.status(200).json({message:"deleted post successfully"})
        }else{
            res.status(403).json({message:"you can delete only your post"})
        }
    }catch(err){
        res.status(500).json({message:"error occured while deleting psot",err})
    }
})
//like/dislike a post
router.put('/:id/like', async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json({message:'post liked successfully'})
        }else{  
            await post.updateOne({$pull: {likes:req.body.userId}})
            res.status(200).json({message:"disliked post successfully"})
        }
    }catch(err){
        res.status(500).json({message:'error occured while liking a post',err})
    }
})
//get a post
router.get('/:id', async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json({message:'got all posts',post});

    }catch(err){
        res.status(500).json({message:'error occured while getting post',err});
    }
})
//get timelime posts
router.get('/timeline/:userId', async (req,res)=>{
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map( (friendId) => {
               return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json({message:"error occured while getting timeline", err})
    }
})

//get users all posts
router.get('/profile/:username', async (req,res)=>{
    try{
        const user = await User.findOne({username:req.params.username})
        const posts = Post.find({userId:user._id})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json({message:"error occured while getting all posts", err})
    }
})
export {router};
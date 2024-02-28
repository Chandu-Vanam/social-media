import React, { useContext, useEffect, useState } from 'react'
import './post.css';
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';
import {format} from 'timeago.js';
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/authContext';

const Post = ({ post }) => {

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState({})
  const PF = import.meta.env.REACT_APP_PUBLIC_FOLDER;
  const {user:currentUser} = useContext(AuthContext)

  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes])

  const likeHandler = () => {
    try{
      axios.put('/posts/'+post._id+'/like', {userId: currentUser._id})
    }catch(err){

    }
    setLike(isLiked? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes])
  useEffect(()=>{
    const fetchUser = async ()=>{
      const res = await axios.get(`/users?userId=${post.userId}`)
      setUser(res.data)
    }
    fetchUser();
  },[post.userId])

  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
            <div className="postTopLeft">
              {/* if no profile picutre exits it adds avator */}
              <Link to={`/profile/${user.username}`}>
                <img className='postProfileImg' src={user.profilePicture ? PF + user.profilePicture : PF + './images/avator.png'} alt="" />
              </Link>
                <span className="postUsername">{user.username}</span>
                <span className="postDate">{format(post.createdAt)}</span>
            </div>
            <div className="postTopRight">
                <MoreVert />
            </div>
        </div>
        <div className="postCenter">
            <span className="postText">{post?.desc}</span>
            <img src={PF+post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
            <div className="postBottomLeft">
                <img src="" alt="" className="likeIcon" onClick={likeHandler} />
                <img src="" alt="" className="likeIcon" onClick={likeHandler} />
                <span className="postLikeCounter">{like} likes</span>
            </div>
            <div className="postBottomRight">
                <span className="postCommentText">{post.comment} comments</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Post

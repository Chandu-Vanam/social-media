import React, { useState, useEffect } from 'react'
import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Rightbar from '../../components/rightbar/Rightbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed'
import axios from 'axios';
import { useParams } from 'react-router';

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({})
  const username = useParams().username;

  useEffect(()=>{
    const fetchUser = async ()=>{
      const res = await axios.get(`/users?username=${username}`)
      setUser(res.data)
    }
    fetchUser();
  },[username])
  return (
    <div>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={user.coverPicture ? PF+user.coverPicture : PF+'person/noCover.png'} alt="" className="profileCoverImg" />
              <img src={user.profilePicture ? PF+user.profilePicture : PF+'person/noAvator.png'} alt="" className="profileUserImg" />
            </div>
            <div className="profileInfo">
              <h4 className='profileInfoName'>{user.username}</h4>
              <span className='profileInfoDesc'>{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

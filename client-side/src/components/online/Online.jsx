import React from 'react'
import './online.css';

const Online = ({ user }) => {
  const PF = import.meta.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div>
        <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
            <img className='rightbarProfileImg' src={PF+user.profilePicture} alt="" />
            <span className='rightbarOnline'></span>
        </div>
        <span className="rightbarUsername">{user.username}</span>
        </li>
    </div>
  )
}

export default Online

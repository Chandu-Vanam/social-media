import React from 'react'
import './closeFriend.css';

const CloseFriend = ({ user }) => {
  const PF = import.meta.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div>
        <li className="sidebarFriend">
        <img src={PF+user.profilePicture} alt="" className="sidebarFriendImg" />
        <span className="sidebarFriendName">{user.username}</span>
        </li>
    </div>
  )
}

export default CloseFriend

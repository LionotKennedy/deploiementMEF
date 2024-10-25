import React from 'react'
import "./profile.scss"
import ProfileCard from '../../components/profile-card/ProfileCard'


const Profile = () => {
  return (
    <>
      <div className='text_profiles' data-aos="slide-down">
        <h1>Profile</h1>
      </div>
      <div className='container__profiles'>
        <ProfileCard />
      </div>
    </>
  )
}

export default Profile

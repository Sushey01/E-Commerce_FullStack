import React from 'react'
import ProfileAccountManagement from './ProfileAccountManagement'
import RecentOrderManagement from './RecentOrderManagement'

const UserProfilePage = () => {
  return (
    <div className='flex flex-col gap-4 p-2 '>
      <ProfileAccountManagement/>
      <RecentOrderManagement/>
    </div>
  )
}

export default UserProfilePage

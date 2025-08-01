import React from 'react'
import ManageAccountOptionList from '../ui/ManageAccountOptionList'
import UserProfilePage from '../components/UserProfilePage'

const ProfileSection = () => {
  return (
    <>
     <div className='flex w-full gap-4 p-2 '>
        <div className='hidden md:flex w-[20%]'>
            <ManageAccountOptionList/>
        </div>
        <div className='w-full md:w-[80%] '>
            <UserProfilePage/>
        </div>
        
    </div> 
    </>
  )
}

export default ProfileSection

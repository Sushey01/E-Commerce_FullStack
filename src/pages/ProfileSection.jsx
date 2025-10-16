import React from 'react'
import ManageAccountOptionList from '../ui/ManageAccountOptionList'
import UserProfilePage from '../components/UserProfilePage'
import LoginMob from '../login/LoginMob';

const ProfileSection = () => {
  const [loggedin, setLoggedin] = React.useState(false);
  return (
    <>
      <div className="flex w-full gap-4 p-2 ">
        <div className="hidden md:flex w-[20%]">
          <ManageAccountOptionList />
        </div>
        
        {loggedin ? <div className="w-full md:w-[80%] ">
          <UserProfilePage />
        </div> : <div className='md:w-full justify-center flex'> <div className='md:w-1/2'><LoginMob /></div></div>}
      </div>
    </>
  );
}

export default ProfileSection

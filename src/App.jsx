import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from './components/Navbar'
import SideDropDown from './ui/SideDropDown'
import MegaSaleHome from './components/MegaSaleHome'
import HeroSection from './pages/HeroSection'
import SideBarMenu from './components/SideBarMenu';

const App = () => {
  return (
    < >
      <Navbar/>
      {/* <SideDropDown/> */}
      {/* <MegaSaleHome/> */}
      {/* <HeroSection/> */}
      <SideBarMenu/>
    </>
  )
}

export default App

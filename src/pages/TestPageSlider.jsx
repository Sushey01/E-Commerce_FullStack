import React from 'react'
import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import NewProductCard from '../components/NewProductCard'
import FeatureCard from '../components/FeatureCard'
import MonthlySaleCard from '../components/MonthlySaleCard'
import LaptopCard from '../components/LaptopCard'
import { useNavigate } from 'react-router-dom'

const TestPageSlider = () => {

  const navigate=useNavigate()


  const featureProducts = [
  {
    id: "1",
    category: "iPad",
    subcategory: "Tablets",
    offer: "Up to 20% off today!",
    image: "/path/to/ipad.webp",
    name: "Apple iPad Pro",
  },
  {
    id: "2",
    category: "Phone",
    subcategory: "Smartphones",
    offer: "Save 10% this week!",
    image: "/path/to/phone.webp",
    name: "Samsung Galaxy",
  },
  // add more feature products
]



    // const Feature =[

    //     <FeatureCard   key={1}/>,
    //     <FeatureCard   key={2}/>,
    //     <FeatureCard   key={3}/>,
    //     <FeatureCard   key={4}/>,
    //     <FeatureCard   key={5}/>,
    //     <FeatureCard   key={6}/>,
    //     <FeatureCard   key={7}/>,
    //     <FeatureCard   key={8}/>,
    //     <FeatureCard   key={9}/>,
    //     <FeatureCard   key={10}/>,
    // ]

const Feature = Array.from({ length: 10 }, (_, i) => (
  <div key={i} className="flex-shrink-0">
    <FeatureCard />
  </div>
));



    // Array.from(...).map(...) pattern is cleaner and shortcut"
  const Month = Array.from({ length: 7 }, (_, i) => (
    <div key={i} className="flex-shrink-0">
      <MonthlySaleCard />
    </div>
  ));




  // Expanded long pattern
  // const Month = [];
  // for (let i=0; i<7; i++){
  //   Month.push(
  //     <div key={i} className='px-2'>
  //       <MonthlySaleCard/>
  //     </div>
  //   )
  // }

  const Laptop = Array.from({length:9}, (_, i)=>(
    <div key={i} className='flex-shrink-0'>
      <LaptopCard/>
    </div>
  ))
  

  
  return (
    <>
    <SectionWiseProductSlider
     title="Feature Products"
     cards={Feature}
     buttonText="Shop Now"
     onButtonClick={()=>navigate("/products")}
     settings={{slidesToShow:5}}
    />

    <SectionWiseProductSlider
    title ="This Month Sale"
    cards={Month}
    buttonText='Shop Now'
    onButtonClick={()=>console.log('navigate to sales')}
    settings={{slidesToShow:6}}
    />

    <SectionWiseProductSlider
    title = "Laptop"
    cards={Laptop}
    buttonText='Shop Now'
    onButtonClick={()=>console.log('navigate to new products')}
    settings={{slidesToShow:5}}
    />
    </>
  )
}

export default TestPageSlider

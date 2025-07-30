import React from 'react'
import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import NewProductCard from '../components/NewProductCard'
import FeatureCard from '../components/FeatureCard'
import MonthlySaleCard from '../components/MonthlySaleCard'
import LaptopCard from '../components/LaptopCard'
import { useNavigate } from 'react-router-dom'
import FeatureCardV1 from '../components/FeatureCardV1'
import featureProducts from '../data/featureProducts'
import monthlySaleProducts from '../data/monthlyProducts'
import laptopProducts from '../data/laptopProducts'

const DynamicPageSlider  = () => {

  const navigate=useNavigate()





 

 const featureCards = featureProducts.map(product => (
    <div key={product.id} className="flex-shrink-0">
      <FeatureCardV1 {...product} />
    </div>
  ));


  const monthlyCards = monthlySaleProducts.map(product=>(
    <div key ={product.id} className='flex-shrink-0'>
        <MonthlySaleCard {...product}/>
    </div>
  ))


  const laptopCards = laptopProducts.map(product=>(
    <div key={product.id} className='flex-shrink-0'>
        <LaptopCard {...product}/>
    </div>
  ))







    // Array.from(...).map(...) pattern is cleaner and shortcut"
//   const Month = Array.from({ length: 7 }, (_, i) => (
//     <div key={i} className="flex-shrink-0">
//       <MonthlySaleCard />
//     </div>
//   ));




  // Expanded long pattern
  // const Month = [];
  // for (let i=0; i<7; i++){
  //   Month.push(
  //     <div key={i} className='px-2'>
  //       <MonthlySaleCard/>
  //     </div>
  //   )
  // }


  

  
  return (
    <>
    <SectionWiseProductSlider
     title="Feature Products"
     cards={featureCards}
     buttonText="Shop Now"
     onButtonClick={()=>navigate("/products")}
     settings={{slidesToShow:5}}
    />

    <SectionWiseProductSlider
    title ="This Month Sale"
    cards={monthlyCards}
    buttonText='Shop Now'
    onButtonClick={()=>console.log('navigate to sales')}
    settings={{slidesToShow:6}}
    />

    <SectionWiseProductSlider
    title = "Laptop"
    cards={laptopCards}
    buttonText='Shop Now'
    onButtonClick={()=>console.log('navigate to new products')}
    settings={{slidesToShow:5}}
    />
    </>
  )
}

export default DynamicPageSlider

import React from 'react'
import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import NewProductCard from '../components/NewProductCard'
import FeatureCard from '../components/FeatureCard'
import MonthlySaleCard from '../components/MonthlySaleCard'

const TestPageSlider = () => {
    const Feature =[

        <FeatureCard   key={1}/>,
        <FeatureCard   key={2}/>,
        <FeatureCard   key={3}/>,
        <FeatureCard   key={4}/>,
        <FeatureCard   key={5}/>,
        <FeatureCard   key={6}/>,
        <FeatureCard   key={7}/>,
        <FeatureCard   key={8}/>,
        <FeatureCard   key={9}/>,
        <FeatureCard   key={10}/>,
    ]


    // Array.from(...).map(...) pattern is cleaner and shortcut"
  const Month = Array.from({ length: 7 }, (_, i) => (
    <div key={i} className="lg:pr-4 md:pr-2">
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


  
  return (
    <>
    <SectionWiseProductSlider
     title="Feature Products"
     cards={Feature}
     buttonText="Shop Now"
     onButtonClick={()=>console.log('navigate to deals')}
     settings={{slidesToShow:5}}
    />

    <SectionWiseProductSlider
    title ="This Month Sale"
    cards={Month}
    buttonText='Shop Now'
    onButtonClick={()=>console.log('navigate to sales')}
    settings={{slidesToShow:6}}
    />
    </>
  )
}

export default TestPageSlider

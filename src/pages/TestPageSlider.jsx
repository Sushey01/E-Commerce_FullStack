import React from 'react'
import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import NewProductCard from '../components/NewProductCard'

const TestPageSlider = () => {
    const cards =[
        <NewProductCard   key={1}/>,
        <NewProductCard   key={2}/>,
        <NewProductCard   key={3}/>,
        <NewProductCard   key={4}/>,
        <NewProductCard   key={5}/>,
        <NewProductCard   key={6}/>,
    ]

  
  return (
    <SectionWiseProductSlider
     title="Friday Black Deals"
     cards={cards}
     buttonText="Shop Now"
     onButtonClick={()=>console.log('navigate to deals')}
     settings={{slidesToShow:3}}
    />
  )
}

export default TestPageSlider

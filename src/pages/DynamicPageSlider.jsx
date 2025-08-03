import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import FeatureCardV1 from '../components/FeatureCardV1'
import MonthlySaleCard from '../components/MonthlySaleCard'
import LaptopCard from '../components/LaptopCard'
import ProductCard from '../components/ProductCardSkeleton'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import featureProducts from '../data/featureProducts'
import monthlySaleProducts from '../data/monthlyProducts'
import laptopProducts from '../data/laptopProducts'

const DynamicPageSlider = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [featureProductsState, setFeatureProductsState] = useState([])
  const [monthlySaleProductsState, setMonthlySaleProductsState] = useState([])
  const [laptopProductsState, setLaptopProductsState] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    // simulate API fetch with 1.5 seconds delay
    setTimeout(() => {
      setFeatureProductsState(featureProducts)
      setMonthlySaleProductsState(monthlySaleProducts)
      setLaptopProductsState(laptopProducts)
      setIsLoading(false)
    }, 1500)
  }, [])

  // Render cards or skeletons based on loading state
  const renderCards = (products, type) => {
    if (isLoading) {
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <ProductCard type={type} isLoading />
          </div>
        ))
    }

    return products.map(product => (
      <div key={product.id} className="flex-shrink-0">
        {/* Use appropriate card component based on type */}
        {type === 'feature' && <FeatureCardV1 {...product} />}
        {type === 'monthly' && <MonthlySaleCard {...product} />}
        {type === 'laptop' && <LaptopCard {...product} />}
      </div>
    ))
  }

  return (
    <>
      <SectionWiseProductSlider
        title="Feature Products"
        cards={renderCards(featureProductsState, 'feature')}
        buttonText="Shop Now"
        onButtonClick={() => navigate('/products')}
        settings={{ slidesToShow: 5 }}
      />

      <SectionWiseProductSlider
        title="This Month Sale"
        cards={renderCards(monthlySaleProductsState, 'monthly')}
        buttonText="Shop Now"
        onButtonClick={() => console.log('navigate to sales')}
        settings={{ slidesToShow: 6 }}
      />

      <SectionWiseProductSlider
        title="Laptop"
        cards={renderCards(laptopProductsState, 'laptop')}
        buttonText="Shop Now"
        onButtonClick={() => console.log('navigate to new products')}
        settings={{ slidesToShow: 5 }}
      />
    </>
  )
}

export default DynamicPageSlider

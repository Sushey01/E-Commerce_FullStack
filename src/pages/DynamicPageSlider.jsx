import SectionWiseProductSlider from '../components/SectionWiseProductSlider'
import FeatureCardV1 from '../components/FeatureCardV1'
import MonthlySaleCard from '../components/MonthlySaleCard'
import LaptopCard from '../components/LaptopCard'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCardSkeleton';
import featureProducts from '../data/featureProducts'
import monthlySaleProducts from '../data/monthlyProducts'
import laptopProducts from '../data/laptopProducts'
import products from '../data/products'
import supabase from '../supabase'

const DynamicPageSlider = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [featureProductsState, setFeatureProductsState] = useState([])
  const [monthlySaleProductsState, setMonthlySaleProductsState] = useState([])
  const [laptopProductsState, setLaptopProductsState] = useState([])

  const navigate = useNavigate()

  // useEffect(() => {
  //   // simulate API fetch with 1.5 seconds delay
  //   setTimeout(() => {
  //     setFeatureProductsState(products)
  //     setMonthlySaleProductsState(monthlySaleProducts)
  //     setLaptopProductsState(laptopProducts)
  //     setIsLoading(false)
  //   }, 1500)
  // }, [])

useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true);
    // setError(null);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      setIsLoading(false);
      return;
    }

    if (data) {
      const mappedData = data.map((product) => {
        const image =
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/150";
        console.log(`Product ${product.id} image: ${image}`); // Debug image URL
        return {
          ...product,
          image,
          title1: product.title ? product.title.split(" ")[0] : "Product",
          title2: product.title
            ? product.title.split(" ").slice(1).join(" ")
            : "",
          subtitle: product.subtitle || "No subtitle",
          label: "Shop Now",
          link: `/product/${product.id}`,
        };
      });

      const featureProducts = mappedData.filter(
        (p) => p.category === "feature"
      );
      const monthlyProducts = mappedData.filter(
        (p) => p.category === "monthly"
      );
      const laptopProducts = mappedData.filter((p) => p.category === "laptop");

      setFeatureProductsState(featureProducts);
      setMonthlySaleProductsState(monthlyProducts);
      setLaptopProductsState(laptopProducts);

      console.log(
        "Feature products:",
        featureProducts.length,
        featureProducts.map((p) => ({ id: p.id, image: p.image }))
      );
      console.log(
        "Monthly products:",
        monthlyProducts.length,
        monthlyProducts.map((p) => ({ id: p.id, image: p.image }))
      );
      console.log(
        "Laptop products:",
        laptopProducts.length,
        laptopProducts.map((p) => ({ id: p.id, image: p.image }))
      );

      if (featureProducts.length === 0) {
        setFeatureProductsState(mappedData);
        console.warn("No feature products found, using all products");
      }
      if (monthlyProducts.length === 0) {
        setMonthlySaleProductsState(mappedData);
        console.warn("No monthly products found, using all products");
      }
      if (laptopProducts.length === 0) {
        setLaptopProductsState(mappedData);
        console.warn("No laptop products found, using all products");
      }
    }

    setIsLoading(false);
  };

  fetchProducts();
}, []);

  // Render cards or skeletons based on loading state
  const renderCards = (products, type) => {
    if (isLoading) {
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-shrink-0 ">
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
        settings={{ slidesToShow: 5, }}
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

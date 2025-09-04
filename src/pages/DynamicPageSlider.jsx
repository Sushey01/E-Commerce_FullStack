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
       // Handle images jsonb safely
       let images = [];
       if (Array.isArray(product.images)) {
         images = product.images;
       } else if (typeof product.images === "string") {
         try {
           images = JSON.parse(product.images);
         } catch {
           images = [];
         }
       }

       const image =
         images && images.length > 0
           ? images[0]
           : "https://via.placeholder.com/150";

       const price = Number(product.price) || 0;
       const oldPrice = Number(product.old_price) || 0;

       return {
         id: product.id,
         title: product.title || "Untitled Product",
         title1: product.title ? product.title.split(" ")[0] : "Product",
         title2: product.title
           ? product.title.split(" ").slice(1).join(" ")
           : "",
         subtitle: product.subtitle || "No subtitle",
         description: product.description || "",
         price,
         oldPrice,
         discount:
           oldPrice && price
             ? Math.round(((oldPrice - price) / oldPrice) * 100)
             : 0,
         reviews: product.reviews || 0,
         rating: Number(product.rating) || 0,
         sold: product.sold || Math.floor(Math.random() * 800), // mock until you add to DB
         inStock: product.inStock || 100, // mock until you add to DB
         outOfStock: product.outofstock || false,
         image,
         images,
         variant:
           product.variant && typeof product.variant === "object"
             ? product.variant
             : {},
         label: "Shop Now",
         link: `/products/${product.id}`,
         category_id: product.category_id, // use this instead of "category"
       };
     });


      const featureProducts = mappedData.filter(
        (p) => p.category === "feature"
      );
      const monthlyProducts = mappedData.filter(
        (p) => p.category === "monthly"
      );
      const laptopProducts = mappedData.filter((p) => p.category === "laptop");

      setFeatureProductsState(
        featureProducts.length > 0 ? featureProducts : mappedData
      );
      setMonthlySaleProductsState(
        monthlyProducts.length > 0 ? monthlyProducts : mappedData
      );
      setLaptopProductsState(
        laptopProducts.length > 0 ? laptopProducts : mappedData
      );
    }


    setIsLoading(false);
  };

  fetchProducts();
}, []);



//   Render cards or skeletons based on loading state
  
  
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

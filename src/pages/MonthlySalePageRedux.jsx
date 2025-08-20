import React, { useEffect, useState } from 'react';
import MonthlySaleCard from '../components/MonthlySaleCard';
import { useDispatch } from 'react-redux';

import { addToWishlist } from '../features/wishlistSlice';
// import { addToCart } from '../features/cartSlice';

const MonthlySalePageRedux = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from your API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data); // ✅ Use the array inside `data`
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // const handleAddToCart = (product) => {
  //   dispatch(addToCart(product));
  // };

  const handleAddToWishList = (product) => {
    dispatch(addToWishlist(product));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <h2 className="text-xl md:text-3xl text-[#777777] px-4 my-4">
        This Month Sales
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 px-3">
        {products.map((prod) => (
          <MonthlySaleCard
            key={prod.id}
            discount={prod.has_discount ? prod.discount : '0%'}
            image={prod.thumbnail_image}
            title={prod.name}
            actualPrice={prod.stroked_price}
            discountedPrice={prod.main_price}
            reviewsCount={prod.rating}
            totalSold={prod.sales}
            stockLeft={prod.stockLeft || 0} // adjust if API provides stock
            onAddToWishList={() => handleAddToWishList(prod)}
            label="Add to Cart"
          />
        ))}
      </div>
    </div>
  );
};

export default MonthlySalePageRedux;

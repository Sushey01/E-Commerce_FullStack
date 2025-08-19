import React from 'react';
import { useGetProductsQuery } from '../features/products/productsApiSlice';

const ProductsList = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <div>
      {data.data.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <img src={product.thumbnail_image} alt={product.name} width={150} />
          <p>Price: ${product.main_price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;

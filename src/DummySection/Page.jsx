import React from 'react';
import MonthlySaleCardRedux from '../components/MonthlySaleCardRedux';
import featureProducts from './Data';
import { useNavigate } from 'react-router-dom';

const Page = () => {

  return (
    <div className='grid grid-cols-4 gap-4 p-4'>
      {featureProducts.map((item) => (
  <MonthlySaleCardRedux
    key={item.id}
    id={item.id}
    title={`${item.title1} ${item.title2}`}
    discount={item.subtitle}
    image={item.image}
    price={`${item.actualPrice} ${item.discountedPrice}`}
    label={item.label}
  />
))}

    </div>
  );
};

export default Page;

import React from 'react';
import FlashSalePage from '../components/FlashSalePage';
import monthlySaleProducts from '../data/monthlyProducts';

const FlashSaleContainer = () => {
  return (
    <div className="md:pt-4 w-full flex flex-col px-2 lg:flex-row pb-5">
      <div className="w-full lg:w-1/2">
        <FlashSalePage products={monthlySaleProducts} />
      </div>
      <div className="w-full lg:w-1/2">
        <FlashSalePage products={monthlySaleProducts} />
      </div>
    </div>
  );
};

export default FlashSaleContainer;

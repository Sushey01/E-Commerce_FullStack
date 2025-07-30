import React from 'react';
import FlashSalePage from '../components/FlashSalePage';
import monthlySaleProducts from '../data/monthlyProducts';

const FlashSaleContainer = () => {
  return (
    <>
      <div className="md:pt-4 flex flex-col gap-3 lg:flex-row px-2 pb-5">
        <FlashSalePage products={monthlySaleProducts} />
        <FlashSalePage products={monthlySaleProducts} />
      </div>
    </>
  );
};

export default FlashSaleContainer;

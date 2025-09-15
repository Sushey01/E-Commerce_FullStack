import React from 'react';
import FlashSalePage from '../components/FlashSalePage';

const FlashSaleContainer = () => {
  return (
    <div className="md:pt-4 w-full flex flex-col px-2 lg:flex-row pb-5">
      <div className="w-full lg:w-1/2">
        <FlashSalePage title="Flash Sales" />
      </div>
      <div className="w-full lg:w-1/2">
        <FlashSalePage title="Top Ranking" />
      </div>
    </div>
  );
};

export default FlashSaleContainer;

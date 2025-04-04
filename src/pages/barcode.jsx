import React from 'react';
import BarcodeSearch from '../components/product/barcode-search';
import GlassContainer from '../components/ui/glass-container';

/**
 * BarcodePage component - Page for barcode search
 * 
 * @returns {JSX.Element} - BarcodePage component
 */
const BarcodePage = () => {
  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Barcode Search
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Enter a product barcode to find detailed nutritional information instantly.
        </p>
      </section>
      
      <div className="max-w-xl mx-auto">
        <BarcodeSearch />
      </div>
      
      <GlassContainer className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">About Barcode Search</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Barcode search allows you to quickly find specific products in our database. 
          Simply enter the product's barcode (typically 8-14 digits found under the barcode on packaging) 
          and we'll retrieve all available information.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          This feature is perfect for checking nutritional information while shopping 
          or to quickly look up products you have at home.
        </p>
      </GlassContainer>
    </div>
  );
};

export default BarcodePage;

import React from 'react';
import Layout, { PageHeader, PageContent, PageSection } from '../components/ui/layout';
import BarcodeScanner from '../components/product/barcode-scanner';

/**
 * BarcodePage component - Redesigned barcode search page
 * 
 * @returns {JSX.Element} - BarcodePage component
 */
const BarcodePage = () => {
  return (
    <Layout>
      <PageHeader
        title="Barcode Search"
        description="Enter a product barcode to find detailed nutritional information instantly."
      />
      
      <div className="max-w-xl mx-auto">
        <PageSection>
          <BarcodeScanner />
        </PageSection>
        
        <PageSection title="About Barcode Search" className="mt-8">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground mb-4">
              Barcode search allows you to quickly find specific products in our database. 
              Simply enter the product's barcode (typically 8-14 digits found under the barcode on packaging) 
              and we'll retrieve all available information.
            </p>
            <p className="text-muted-foreground">
              This feature is perfect for checking nutritional information while shopping 
              or to quickly look up products you have at home.
            </p>
          </div>
        </PageSection>
      </div>
    </Layout>
  );
};

export default BarcodePage;
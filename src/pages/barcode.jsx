import React, { useState, useEffect } from 'react';
import { PageHeader, PageContent, PageSection } from '../components/ui/layout';
import BarcodeScanner from '../components/product/barcode-scanner';
import CameraBarcodeScanner from '../components/product/camera-barcode-scanner';
import { Button } from '../components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

/**
 * BarcodePage component - Redesigned barcode search page with camera scanning
 * 
 * @returns {JSX.Element} - BarcodePage component
 */
const BarcodePage = () => {
  const [scanMode, setScanMode] = useState('manual'); // 'manual' or 'camera'
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Check if camera is supported
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          setIsCameraSupported(true);
        } else {
          setIsCameraSupported(false);
        }
      } catch (error) {
        console.error('Error checking camera support:', error);
        setIsCameraSupported(false);
      }
    };
    
    checkCameraSupport();
  }, []);

  // Handle barcode detection from camera
  const handleBarcodeDetected = (barcode) => {
    if (barcode) {
      navigate(`/product/${barcode}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Barcode Search"
        description="Find detailed nutritional information by scanning or entering a product barcode."
      />
      
      <div className="max-w-xl mx-auto">
        {/* Mode toggle buttons */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={scanMode === 'manual' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setScanMode('manual')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Manual Entry
          </Button>
          
          <Button
            variant={scanMode === 'camera' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setScanMode('camera')}
            disabled={!isCameraSupported}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Camera Scan
          </Button>
        </div>

        <PageSection>
          {/* Show appropriate scanner based on mode */}
          {scanMode === 'manual' ? (
            <BarcodeScanner />
          ) : (
            <CameraBarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
          )}

          {/* Camera not available message */}
          {scanMode === 'camera' && !isCameraSupported && (
            <div className="mt-4 p-4 border rounded-md bg-amber-50 text-amber-800">
              <p className="text-sm">
                Camera scanning is not available on this device or browser.
                Please use manual barcode entry instead.
              </p>
            </div>
          )}
        </PageSection>
        
        <PageSection title="About Barcode Search" className="mt-8">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground mb-4">
              Barcode search allows you to quickly find specific products in our database. 
              {scanMode === 'camera' ? (
                <>
                  Simply position the product barcode within the camera frame and we'll 
                  automatically detect and look up the product information.
                </>
              ) : (
                <>
                  Simply enter the product's barcode (typically 8-14 digits found under the barcode on packaging) 
                  and we'll retrieve all available information.
                </>
              )}
            </p>
            <p className="text-muted-foreground">
              This feature is perfect for checking nutritional information while shopping 
              or to quickly look up products you have at home.
            </p>
          </div>
        </PageSection>

        {/* Tips for scanning */}
        {scanMode === 'camera' && (
          <PageSection title="Tips for Better Scanning" className="mt-4">
            <div className="rounded-lg border bg-card p-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ensure good lighting for better barcode detection</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hold the camera steady and position the barcode within the frame</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>If scanning fails, try switching to manual entry mode</span>
                </li>
              </ul>
            </div>
          </PageSection>
        )}
      </div>
    </>
  );
};

export default BarcodePage;
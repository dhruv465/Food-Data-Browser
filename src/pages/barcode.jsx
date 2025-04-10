import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "../components/product/barcode-scanner";
import CameraBarcodeScanner from "../components/product/camera-barcode-scanner";
import { PageHeader, PageSection } from "../components/ui/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const BarcodePage = () => {
  const [activeTab, setActiveTab] = useState("camera"); // Default to camera mode
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState("");
  const navigate = useNavigate();

  // Check if camera is supported
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          setIsCameraSupported(true);
        } else {
          setIsCameraSupported(false);
          // Fall back to manual entry if camera not supported
          setActiveTab("manual");
        }
      } catch (error) {
        console.error("Error checking camera support:", error);
        setIsCameraSupported(false);
        setActiveTab("manual");
      }
    };

    checkCameraSupport();
  }, []);

  // Handle barcode detection from camera
  const handleBarcodeDetected = (barcode) => {
    if (barcode) {
      setLastScannedBarcode(barcode);
      setScanSuccess(true);

      // Show success animation briefly before navigating
      setTimeout(() => {
        navigate(`/product/${barcode}`);
      }, 800);
    }
  };

  return (
    <>
      <PageHeader
        title="Barcode Search"
        description="Find detailed nutritional information by scanning or entering a product barcode."
      />

      <div className="max-w-xl mx-auto mt-4">
        {/* Success animation overlay */}
        {scanSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="text-center space-y-6 p-8 rounded-xl bg-card border-2 border-primary shadow-xl animate-in zoom-in-95 duration-200">
              <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center animate-in zoom-in-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">
                  Barcode Scanned!
                </h3>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="font-mono text-lg font-bold tracking-wider">
                    {lastScannedBarcode}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground animate-pulse">
                Loading product details...
              </p>
            </div>
          </div>
        )}

        <Tabs
          defaultValue={isCameraSupported ? "camera" : "manual"}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="camera"
              disabled={!isCameraSupported}
              className="flex items-center"
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
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center">
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
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <TabsContent value="camera" className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <CameraBarcodeScanner
                  onBarcodeDetected={handleBarcodeDetected}
                />
              </div>

              {/* Camera not available message */}
              {!isCameraSupported && (
                <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
                  <p className="text-sm">
                    Camera scanning is not available on this device or browser.
                    Please use manual barcode entry instead.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual">
              <div className="rounded-lg border p-4">
                <BarcodeScanner />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <PageSection title="About Barcode Search" className="mt-8">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground mb-4">
              Barcode search allows you to quickly find specific products in our
              database.
              {activeTab === "camera" ? (
                <>
                  Simply position the product barcode within the camera frame
                  and we'll automatically detect and look up the product
                  information.
                </>
              ) : (
                <>
                  Simply enter the product's barcode (typically 8-14 digits
                  found under the barcode on packaging) and we'll retrieve all
                  available information.
                </>
              )}
            </p>
            <p className="text-muted-foreground">
              This feature is perfect for checking nutritional information while
              shopping or to quickly look up products you have at home.
            </p>
          </div>
        </PageSection>

        {/* Tips for scanning - always show but with different content based on active tab */}
        <PageSection
          title={
            activeTab === "camera"
              ? "Tips for Better Scanning"
              : "Tips for Finding Barcodes"
          }
          className="mt-4"
        >
          <div className="rounded-lg border bg-card p-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {activeTab === "camera" ? (
                <>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Ensure good lighting for better barcode detection
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Hold the camera steady and position the barcode within the
                      frame
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      If scanning fails, try switching to manual entry mode
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Barcodes are typically found on the back or bottom of
                      product packaging
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Most food products use EAN-13 barcodes (13 digits) or
                      UPC-A (12 digits)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      The barcode number is usually printed directly below the
                      barcode lines
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </PageSection>
      </div>
    </>
  );
};

export default BarcodePage;

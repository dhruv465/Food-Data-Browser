import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";
import BarcodeImage from "./barcode-image";
import { startBarcodeDetection, stopBarcodeDetection } from "../../lib/barcode-detection";

/**
 * CameraBarcodeScanner component - Camera-based barcode scanner for mobile devices
 * Automatically scans barcodes when camera is active without requiring manual button press
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onBarcodeDetected - Callback when barcode is detected
 * @returns {JSX.Element} - CameraBarcodeScanner component
 */
const CameraBarcodeScanner = ({ className, onBarcodeDetected, ...props }) => {
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [detectedBarcode, setDetectedBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // Default to back camera
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Auto-scan timeout reference
  const autoScanTimeoutRef = useRef(null);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      setHasPermission(true);
      setIsCameraActive(true);
      // Clean up stream when done
      return () => {
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      if (error.name === "NotAllowedError") {
        setErrorMessage("Camera access denied. Please enable camera permissions.");
      } else if (error.name === "NotFoundError") {
        setErrorMessage("No camera found on your device.");
      } else {
        setErrorMessage(`Error accessing camera: ${error.message}`);
      }
    }
  }, [facingMode]);

  // Start camera when component mounts
  useEffect(() => {
    if (isCameraActive) {
      const cleanup = requestCameraPermission();
      
      // Automatically start scanning when camera becomes active
      // Small delay to ensure camera is fully initialized
      autoScanTimeoutRef.current = setTimeout(() => {
        setIsScanning(true);
      }, 1000);
      
      return () => {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
        }
        if (autoScanTimeoutRef.current) {
          clearTimeout(autoScanTimeoutRef.current);
        }
        setIsCameraActive(false);
        setIsScanning(false);
      };
    }
  }, [isCameraActive, requestCameraPermission]);

  // Scanner instance ref
  const scannerRef = useRef(null);
  
  // Process frames for barcode detection
  const processFrames = useCallback(() => {
    if (!isScanning || !webcamRef.current || !isCameraActive) return;
    
    // Create a video element ID for the scanner
    const videoElementId = 'barcode-scanner-video';
    
    // Make sure the webcam video element has the correct ID
    if (webcamRef.current.video) {
      webcamRef.current.video.id = videoElementId;
    }
    
    // Start barcode detection
    const startScanning = async () => {
      try {
        // Start the scanner
        const scanner = await startBarcodeDetection(
          videoElementId,
          (decodedText) => {
            // On successful detection
            setDetectedBarcode(decodedText);
            setIsScanning(false);
            
            if (onBarcodeDetected) {
              onBarcodeDetected(decodedText);
            }
            
            // Stop the scanner after detection
            if (scannerRef.current) {
              stopBarcodeDetection(scannerRef.current);
              scannerRef.current = null;
            }
          },
          (errorMessage) => {
            // Only log actual errors, not just "no barcode found"
            if (!errorMessage.includes('NotFoundException')) {
              console.error('Barcode scanning error:', errorMessage);
            }
          }
        );
        
        // Save the scanner instance
        scannerRef.current = scanner;
      } catch (error) {
        console.error('Failed to start barcode detection:', error);
        setErrorMessage('Failed to start barcode scanner: ' + error.message);
        setIsScanning(false);
      }
    };
    
    startScanning();
    
    // Cleanup function
    return () => {
      if (scannerRef.current) {
        stopBarcodeDetection(scannerRef.current);
        scannerRef.current = null;
      }
    };
  }, [isScanning, isCameraActive, onBarcodeDetected]);

  // Start processing frames when scanning is active
  useEffect(() => {
    if (isScanning) {
      const cleanup = processFrames();
      return cleanup;
    }
  }, [isScanning, processFrames]);
  
  // Cleanup scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopBarcodeDetection(scannerRef.current);
        scannerRef.current = null;
      }
    };
  }, []);

  // Toggle camera
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    setDetectedBarcode("");
  };

  // Reset scanning state and try again
  const resetScanning = () => {
    setDetectedBarcode("");
    setErrorMessage("");
    // Restart scanning
    setIsScanning(false);
    setTimeout(() => setIsScanning(true), 300);
  };
  
  // Pause scanning temporarily
  const pauseScanning = () => {
    if (isScanning) {
      setIsScanning(false);
      if (scannerRef.current) {
        stopBarcodeDetection(scannerRef.current);
        scannerRef.current = null;
      }
    } else {
      setIsScanning(true);
    }
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    // This will trigger the useEffect to request camera permissions again
    if (isCameraActive) {
      setIsCameraActive(false);
      setTimeout(() => setIsCameraActive(true), 300);
    }
  };

  // Navigate to product page with detected barcode
  const navigateToProduct = () => {
    if (detectedBarcode) {
      navigate(`/product/${detectedBarcode}`);
    }
  };

  // Video constraints
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      {/* Camera permission error message */}
      {hasPermission === false && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>{errorMessage || "Camera access is required for barcode scanning."}</p>
          <Button 
            onClick={requestCameraPermission} 
            variant="outline" 
            className="mt-2"
          >
            Request Camera Access
          </Button>
        </div>
      )}

      {/* Camera toggle button (only show if not already active) */}
      {!isCameraActive && hasPermission !== false && (
        <Button 
          onClick={toggleCamera} 
          className="w-full"
          size="lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Open Camera to Auto-Scan Barcode
        </Button>
      )}

      {/* Camera view */}
      {isCameraActive && (
        <div className="relative rounded-lg overflow-hidden border bg-card">
          {/* Camera feed */}
          <div className="aspect-[4/3] relative bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Scanning target area */}
              <div className={cn(
                "border-2 rounded-lg w-4/5 aspect-[3/2] max-w-xs",
                isScanning ? "border-primary animate-pulse" : "border-white/50"
              )}>
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary" />
              </div>
              
              {/* Scanning status text */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className={cn(
                  "py-1 px-3 rounded-full inline-block text-sm",
                  isScanning 
                    ? "text-white bg-primary/70 animate-pulse" 
                    : "text-white bg-black/50"
                )}>
                  {isScanning 
                    ? "Scanning automatically... Point at barcode" 
                    : "Tap to resume scanning"}
                </p>
              </div>
            </div>
          </div>

          {/* Camera controls */}
          <div className="p-4 flex justify-between items-center">
            <Button
              onClick={toggleCamera}
              variant="outline"
              size="icon"
              title="Close Camera"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>

            {/* Pause/Resume scanning button */}
            <Button
              onClick={pauseScanning}
              variant={isScanning ? "default" : "outline"}
              size="sm"
              className="px-4"
            >
              {isScanning ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-background mr-2 animate-pulse"></div>
                  <span>Auto-Scanning</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Resume</span>
                </>
              )}
            </Button>

            {/* Switch camera button (only on mobile) */}
            {isMobile && (
              <Button
                onClick={switchCamera}
                variant="outline"
                size="icon"
                title="Switch Camera"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Detected barcode result */}
      {detectedBarcode && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Barcode Detected</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScanning}
            >
              Scan Again
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="font-mono text-center text-lg">{detectedBarcode}</p>
          </div>
          
          <BarcodeImage barcode={detectedBarcode} className="my-2" />
          
          <Button onClick={navigateToProduct} className="w-full">
            View Product Details
          </Button>
        </div>
      )}

      {/* Instructions */}
      {isCameraActive && !detectedBarcode && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          <p>{isScanning 
            ? "Just point your camera at a barcode - it will scan automatically" 
            : "Scanning paused. Tap 'Resume' to continue scanning."}</p>
        </div>
      )}
    </div>
  );
};

export default CameraBarcodeScanner;
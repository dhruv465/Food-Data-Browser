/**
 * Barcode detection service
 * 
 * This service provides functions for detecting barcodes from images or video streams
 * using the Html5QrCode library.
 */

// This function will be used to detect barcodes from a video stream
// It requires the Html5QrCode library to be installed
// npm install html5-qrcode
export const startBarcodeDetection = async (videoElementId, onDetect, onError) => {
  try {
    // Dynamically import Html5QrCode to avoid issues with SSR
    const { Html5Qrcode } = await import('html5-qrcode');
    
    // Create instance
    const html5QrCode = new Html5Qrcode(videoElementId);
    
    // Start scanning
    await html5QrCode.start(
      { facingMode: "environment" }, // Use back camera
      {
        fps: 10, // Frame rate
        qrbox: { width: 250, height: 150 }, // Scanning area size
        aspectRatio: 1.0, // Aspect ratio of the video feed
        disableFlip: false, // Allow image flip if needed
        formatsToSupport: [
          // Barcode formats to detect
          Html5Qrcode.FORMATS.EAN_13,
          Html5Qrcode.FORMATS.EAN_8,
          Html5Qrcode.FORMATS.UPC_A,
          Html5Qrcode.FORMATS.UPC_E,
          Html5Qrcode.FORMATS.CODE_39,
          Html5Qrcode.FORMATS.CODE_128
        ]
      },
      (decodedText, decodedResult) => {
        // On successful detection
        if (onDetect) {
          onDetect(decodedText, decodedResult);
        }
      },
      (errorMessage) => {
        // On error (this is called frequently when no barcode is detected)
        // We can ignore most of these errors as they're just "no barcode found"
        if (onError && errorMessage.includes('NotFoundException')) {
          // Only report actual errors, not just "no barcode found"
          onError(errorMessage);
        }
      }
    );
    
    // Return the scanner instance so it can be stopped later
    return html5QrCode;
  } catch (error) {
    console.error('Error starting barcode detection:', error);
    if (onError) {
      onError(error.message);
    }
    return null;
  }
};

// Stop the barcode detection
export const stopBarcodeDetection = async (scannerInstance) => {
  if (!scannerInstance) return;
  
  try {
    // Stop scanning
    await scannerInstance.stop();
    return true;
  } catch (error) {
    console.error('Error stopping barcode detection:', error);
    return false;
  }
};

// Validate a barcode format
export const validateBarcode = (barcode) => {
  if (!barcode || typeof barcode !== 'string') {
    return false;
  }
  
  // Basic validation - barcodes are typically 8-14 digits
  return /^\d{8,14}$/.test(barcode.trim());
};
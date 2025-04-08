import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { cn } from "../../lib/utils";

/**
 * BarcodeImage component - Renders a barcode image from a barcode number
 *
 * @param {Object} props - Component props
 * @param {string} props.barcode - The barcode number to render
 * @param {string} props.format - The barcode format (default: 'EAN13')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.options - Additional options for JsBarcode
 * @returns {JSX.Element} - BarcodeImage component
 */
const BarcodeImage = ({
  barcode,
  format = "EAN13",
  className,
  width = 2,
  height = 100,
  displayValue = true,
  fontSize = 20,
  ...props
}) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && barcode) {
      try {
        // Generate barcode using JsBarcode
        JsBarcode(barcodeRef.current, barcode, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          margin: 10,
          background: "transparent",
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [barcode, format, width, height, displayValue, fontSize]);

  if (!barcode) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-4 border rounded-md bg-muted/20",
          className
        )}
        {...props}
      >
        <p className="text-muted-foreground text-sm">No barcode available</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <svg ref={barcodeRef} className="w-full"></svg>
    </div>
  );
};

export default BarcodeImage;

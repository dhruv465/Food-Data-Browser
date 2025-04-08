import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { getProductByBarcode } from "../../lib/api/foodApi";
import BarcodeImage from "./barcode-image";

/**
 * BarcodeScanner component - Modern barcode input with validation
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - BarcodeScanner component
 */
const BarcodeScanner = ({ className, ...props }) => {
  const [barcode, setBarcode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setBarcode(value);

    // Clear error when typing
    if (!isValid) {
      setIsValid(true);
      setErrorMessage("");
    }
  };

  // Validate barcode format
  const validateBarcode = (code) => {
    // Basic validation - barcodes are typically 8-14 digits
    if (!code.trim()) {
      setIsValid(false);
      setErrorMessage("Please enter a barcode");
      return false;
    }

    if (!/^\d{8,14}$/.test(code.trim())) {
      setIsValid(false);
      setErrorMessage("Barcode should be 8-14 digits");
      return false;
    }

    return true;
  };

  // State for API errors
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateBarcode(barcode)) {
      setIsLoading(true);
      setApiError("");

      try {
        // Check if product exists before navigating
        await getProductByBarcode(barcode.trim());
        navigate(`/product/${barcode.trim()}`);
      } catch (error) {
        setIsValid(false);
        if (
          error.message.includes("not found") ||
          error.response?.status === 404
        ) {
          setErrorMessage(`Product with barcode ${barcode.trim()} not found`);
        } else {
          setApiError(error.message || "Failed to fetch product information");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show barcode image when valid barcode is entered
  const showBarcodeImage =
    barcode &&
    isValid &&
    barcode.trim().length >= 8 &&
    barcode.trim().length <= 14;

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={barcode}
              onChange={handleChange}
              placeholder="Enter product barcode (e.g., 3017620422003)"
              className={cn(
                "w-full px-4 py-2 border rounded-md bg-background",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                !isValid && "border-destructive focus:ring-destructive"
              )}
              aria-invalid={!isValid}
              aria-describedby={!isValid ? "barcode-error" : undefined}
            />

            {!isValid && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-destructive"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {!isValid && (
            <p id="barcode-error" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
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
                Search Barcode
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setBarcode("")}
            disabled={!barcode}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Display barcode image when valid barcode is entered */}
      {showBarcodeImage && (
        <div className="mt-4 p-4 border rounded-md bg-background">
          <p className="text-sm font-medium mb-2">Barcode Preview:</p>
          <BarcodeImage
            barcode={barcode.trim()}
            format="EAN13"
            height={80}
            className="max-w-full bg-white p-3 rounded-md border"
          />
        </div>
      )}

      {apiError && (
        <div className="mt-4 p-4 border border-destructive rounded-md bg-destructive/10">
          <p className="text-destructive font-medium">Error</p>
          <p className="text-sm">{apiError}</p>
        </div>
      )}

      <div className="mt-6 p-4 border rounded-md bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Example Barcodes to Try:</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              onClick={() => setBarcode("3017620422003")}
              className="text-primary hover:underline"
            >
              3017620422003
            </button>
            <span className="text-muted-foreground ml-2">(Nutella)</span>
          </li>
          <li>
            <button
              onClick={() => setBarcode("5449000000996")}
              className="text-primary hover:underline"
            >
              5449000000996
            </button>
            <span className="text-muted-foreground ml-2">(Coca-Cola)</span>
          </li>
          <li>
            <button
              onClick={() => setBarcode("7622210449283")}
              className="text-primary hover:underline"
            >
              7622210449283
            </button>
            <span className="text-muted-foreground ml-2">(Oreo)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScanner;

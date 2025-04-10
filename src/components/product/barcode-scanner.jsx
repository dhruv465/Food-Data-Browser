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
      {/* Main Search Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />

        <div className="relative space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Barcode Search
            </h2>
            <p className="text-muted-foreground">
              Enter a product barcode to find detailed nutritional information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-foreground group-focus-within:text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="barcode-input"
                type="text"
                value={barcode}
                onChange={handleChange}
                placeholder="Enter barcode number..."
                className={cn(
                  "w-full pl-10 pr-10 py-3.5 border-0 rounded-xl",
                  "bg-background/80 dark:bg-background/40 backdrop-blur-sm",
                  "text-foreground placeholder:text-muted-foreground/60",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "transition-all duration-200",
                  "border border-input hover:border-primary/50",
                  !isValid && "ring-2 ring-destructive/20"
                )}
                aria-invalid={!isValid}
                aria-describedby={!isValid ? "barcode-error" : undefined}
              />
              {barcode && (
                <button
                  onClick={() => setBarcode("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {!isValid && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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

            <Button
              type="submit"
              className="w-full px-6 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </Button>

            {!isValid && (
              <p
                id="barcode-error"
                className="text-sm text-destructive flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Barcode Preview and Examples Section */}
      <div className="mt-6">
        {showBarcodeImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Example Barcodes */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="text-lg font-medium mb-2 text-foreground">
                Try these example barcodes
              </h3>
              <div className="space-y-1">
                {[
                  { code: "3017620422003", name: "Nutella" },
                  { code: "5449000000996", name: "Coca-Cola" },
                  { code: "7622210449283", name: "Oreo" },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setBarcode(item.code)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-background/80 dark:hover:bg-background/40 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-primary">
                        {item.code}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Barcode Preview Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Barcode Preview</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Format: EAN-13
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {barcode.trim().length} digits
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background/80 dark:bg-background/40 backdrop-blur-sm border border-primary/10">
                <BarcodeImage
                  barcode={barcode.trim()}
                  format="EAN13"
                  height={80}
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Example Barcodes (when no preview) */
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Try these example barcodes
            </h3>
            <div className="space-y-1">
              {[
                { code: "3017620422003", name: "Nutella" },
                { code: "5449000000996", name: "Coca-Cola" },
                { code: "7622210449283", name: "Oreo" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setBarcode(item.code)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-background/80 dark:hover:bg-background/40 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary">{item.code}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="mt-6 p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-destructive mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-destructive font-medium">Error</p>
              <p className="text-sm text-destructive/80">{apiError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;

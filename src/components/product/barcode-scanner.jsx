import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * BarcodeScanner component - Modern barcode input with validation
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - BarcodeScanner component
 */
const BarcodeScanner = ({ className, ...props }) => {
  const [barcode, setBarcode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setBarcode(value);
    
    // Clear error when typing
    if (!isValid) {
      setIsValid(true);
      setErrorMessage('');
    }
  };

  // Validate barcode format
  const validateBarcode = (code) => {
    // Basic validation - barcodes are typically 8-14 digits
    if (!code.trim()) {
      setIsValid(false);
      setErrorMessage('Please enter a barcode');
      return false;
    }
    
    if (!/^\d{8,14}$/.test(code.trim())) {
      setIsValid(false);
      setErrorMessage('Barcode should be 8-14 digits');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateBarcode(barcode)) {
      navigate(`/product/${barcode.trim()}`);
    }
  };

  return (
    <div 
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
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
          <Button type="submit" className="w-full sm:w-auto">
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
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setBarcode('')}
            disabled={!barcode}
          >
            Clear
          </Button>
        </div>
      </form>
      
      <div className="mt-6 p-4 border rounded-md bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Example Barcodes to Try:</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button 
              onClick={() => setBarcode('3017620422003')} 
              className="text-primary hover:underline"
            >
              3017620422003
            </button>
            <span className="text-muted-foreground ml-2">(Nutella)</span>
          </li>
          <li>
            <button 
              onClick={() => setBarcode('5449000000996')} 
              className="text-primary hover:underline"
            >
              5449000000996
            </button>
            <span className="text-muted-foreground ml-2">(Coca-Cola)</span>
          </li>
          <li>
            <button 
              onClick={() => setBarcode('7622210449283')} 
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
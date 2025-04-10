# Food Data Browser

A modern web application for browsing and searching food product data, built with React and the Open Food Facts API.

## Problem Solving Approach

### 1. Understanding Requirements
- Analyzed the core requirements for food product browsing and search
- Identified key features needed: search, filtering, product details, and barcode scanning
- Determined the need for real-time updates and responsive design

### 2. Architecture Design
- Chose React for component-based architecture
- Implemented React Query for efficient data management
- Designed a modular structure for components and pages
- Planned state management strategy using Context and URL parameters

### 3. Implementation Strategy
- **Search Functionality**
  - Implemented debounced search to optimize API calls
  - Added URL synchronization for shareable searches
  - Created clear search functionality with proper state management
  - Ensured search results update in real-time

- **Product Display**
  - Designed responsive grid layout for product cards
  - Implemented detailed product view with nutrition information
  - Added image handling with fallback support
  - Created blurred background effect for product images

- **Barcode Scanner**
  - Implemented real-time barcode detection
  - Added example barcodes for testing
  - Created error handling and user feedback
  - Designed side-by-side layout for preview and examples

### 4. Testing and Optimization
- Performed component testing for search functionality
- Optimized performance with lazy loading and debouncing
- Ensured responsive design across devices
- Implemented error boundaries for graceful error handling

### 5. Challenges and Solutions
- **Challenge**: Search state persistence and clearing
  - **Solution**: Implemented URL-based state management using `useLocation` and `useSearchParams`
  - **Solution**: Created `handleClearSearch` function that:
    - Resets search term state
    - Updates URL to remove search parameters
    - Prevents URL from overriding cleared state
    - Maintains synchronization between input and URL
  - **Solution**: Added debounced search to prevent excessive API calls
  - **Solution**: Implemented proper state cleanup on component unmount

- **Challenge**: Image loading and optimization
  - **Solution**: Added fallback images with `onError` handlers
  - **Solution**: Implemented blurred background effect using:
    - Separate background image container
    - `blur-xl` and `scale-110` classes for zoom effect
    - Semi-transparent overlay for depth
    - Proper aspect ratio maintenance
  - **Solution**: Created responsive image containers with:
    - `object-contain` for proper scaling
    - `aspect-square` for consistent dimensions
    - Centered positioning with flexbox
    - Proper error state handling

- **Challenge**: Real-time barcode scanning
  - **Solution**: Created side-by-side layout using:
    - Grid layout for larger screens
    - Stack layout for mobile
    - Consistent gradient backgrounds
    - Proper spacing and padding
  - **Solution**: Added example barcodes with:
    - Vertical stack layout
    - Full-width buttons
    - Clear visual hierarchy
    - Responsive design
  - **Solution**: Implemented error handling with:
    - Clear error messages
    - Visual feedback
    - Proper state management
    - User-friendly instructions

- **Challenge**: State Management and Performance
  - **Solution**: Implemented React Query for:
    - Efficient data fetching
    - Automatic caching
    - Background updates
    - Error handling
  - **Solution**: Used Context API for:
    - Theme management
    - Global state sharing
    - Performance optimization
    - Clean component structure
  - **Solution**: Added proper cleanup with:
    - useEffect cleanup functions
    - State reset on unmount
    - Memory leak prevention
    - Resource optimization

## Features

- 🔍 Advanced search functionality with real-time results
- 📱 Responsive design for all devices
- 🎨 Modern UI with dark/light theme support
- 📊 Detailed product information display
- 🏷️ Barcode scanning capability
- 🎯 Filtering and sorting options
- 🔄 Infinite scroll for seamless browsing

## Implementation Details

### Search Functionality
- Implemented using React Query for efficient data fetching and caching
- Debounced search to prevent excessive API calls
- URL synchronization for shareable search results
- Clear search functionality with proper state management

### Product Display
- Responsive grid layout for product cards
- Detailed product view with nutrition information
- Image handling with fallback support
- Blurred background effect for product images

### Barcode Scanner
- Real-time barcode detection
- Example barcodes for testing
- Error handling and user feedback
- Side-by-side layout for preview and examples

### State Management
- React Context for theme management
- URL-based state for search parameters
- Local state for UI interactions
- Proper cleanup and memory management

### Performance Optimizations
- Lazy loading of components
- Image optimization
- Debounced API calls
- Efficient state updates

## Time Taken
- Initial setup and basic structure: 2 hours
- Search functionality implementation: 3 hours
- Product display and detail view: 4 hours
- Barcode scanner implementation: 3 hours
- UI/UX improvements and refinements: 2 hours
- Testing and bug fixes: 2 hours

Total time: Approximately 16 hours

## Technologies Used
- React
- React Query
- Tailwind CSS
- Open Food Facts API
- React Router
- Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the MIT License.

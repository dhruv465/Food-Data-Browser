/**
 * Filter products based on filter criteria
 * 
 * @param {Array} products - Array of products to filter
 * @param {Object} filters - Filter criteria
 * @param {Array} filters.categories - Categories to filter by
 * @param {Array} filters.sugar - Sugar range [min, max]
 * @returns {Array} - Filtered products
 */
export const filterProducts = (products, filters) => {
    if (!products || !Array.isArray(products)) return [];
    if (!filters) return products;

    return products.filter(product => {
        // Filter by categories
        if (filters.categories && filters.categories.length > 0) {
            // Extract categories from product
            const productCategories = product.categories_tags || [];
            const normalizedProductCategories = productCategories.map(cat => {
                // Remove language prefix (e.g., 'en:') and convert to readable format
                return cat.split(':').pop().replace(/-/g, ' ').toLowerCase();
            });

            // Check if any selected category matches
            const normalizedSelectedCategories = filters.categories.map(cat => cat.toLowerCase());
            const hasMatchingCategory = normalizedSelectedCategories.some(selectedCat =>
                normalizedProductCategories.some(productCat => productCat.includes(selectedCat))
            );

            if (!hasMatchingCategory) return false;
        }

        // Filter by sugar content
        if (filters.sugar && Array.isArray(filters.sugar) && filters.sugar.length === 2) {
            const [minSugar, maxSugar] = filters.sugar;
            const sugarValue = parseFloat(product.nutriments?.sugars_100g || 0);

            if (sugarValue < minSugar || sugarValue > maxSugar) return false;
        }

        return true;
    });
};

/**
 * Sort products based on sort option
 * 
 * @param {Array} products - Array of products to sort
 * @param {string} sortOption - Sort option ID
 * @returns {Array} - Sorted products
 */
export const sortProducts = (products, sortOption) => {
    if (!products || !Array.isArray(products)) return [];
    if (!sortOption) return products;

    const sortedProducts = [...products];

    switch (sortOption) {
        case 'name-asc':
            return sortedProducts.sort((a, b) => {
                return (a.product_name || '').localeCompare(b.product_name || '');
            });

        case 'name-desc':
            return sortedProducts.sort((a, b) => {
                return (b.product_name || '').localeCompare(a.product_name || '');
            });

        case 'grade-asc':
            return sortedProducts.sort((a, b) => {
                const gradeA = a.nutrition_grades || 'z';
                const gradeB = b.nutrition_grades || 'z';
                return gradeA.localeCompare(gradeB);
            });

        case 'grade-desc':
            return sortedProducts.sort((a, b) => {
                const gradeA = a.nutrition_grades || 'z';
                const gradeB = b.nutrition_grades || 'z';
                return gradeB.localeCompare(gradeA);
            });

        case 'calories-asc':
            return sortedProducts.sort((a, b) => {
                const caloriesA = parseFloat(a.nutriments?.energy_value || 0);
                const caloriesB = parseFloat(b.nutriments?.energy_value || 0);
                return caloriesA - caloriesB;
            });

        case 'calories-desc':
            return sortedProducts.sort((a, b) => {
                const caloriesA = parseFloat(a.nutriments?.energy_value || 0);
                const caloriesB = parseFloat(b.nutriments?.energy_value || 0);
                return caloriesB - caloriesA;
            });

        default:
            return sortedProducts;
    }
};

/**
 * Apply both filtering and sorting to products
 * 
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @param {string} sortOption - Sort option ID
 * @returns {Array} - Filtered and sorted products
 */
export const filterAndSortProducts = (products, filters, sortOption) => {
    const filteredProducts = filterProducts(products, filters);
    return sortProducts(filteredProducts, sortOption);
};
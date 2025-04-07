/**
 * Generates initials or fallback text for missing data
 * @param {string} text - The original text
 * @param {Object} options - Options for generating fallback text
 * @param {number} options.maxInitials - Maximum number of initials to generate (default: 2)
 * @param {string} options.defaultText - Default text when no initials can be generated (default: 'N/A')
 * @returns {string} - Generated initials or fallback text
 */
export function generateFallbackText(text, { maxInitials = 2, defaultText = 'N/A' } = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return defaultText;
  }

  // Split text into words and filter out empty strings
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return defaultText;
  }

  // Generate initials from words
  const initials = words
    .slice(0, maxInitials)
    .map(word => word[0].toUpperCase())
    .join('');

  return initials || defaultText;
}

/**
 * Formats text with fallback for missing data
 * @param {string} text - The text to format
 * @param {Object} options - Options for formatting
 * @param {boolean} options.useInitials - Whether to use initials as fallback (default: false)
 * @param {string} options.defaultText - Default text for missing data (default: 'N/A')
 * @param {number} options.maxInitials - Maximum number of initials when useInitials is true (default: 2)
 * @returns {string} - Formatted text with fallback
 */
export function formatWithFallback(text, { useInitials = false, defaultText = 'N/A', maxInitials = 2 } = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return useInitials
      ? generateFallbackText(text, { maxInitials, defaultText })
      : defaultText;
  }

  return text.trim();
}
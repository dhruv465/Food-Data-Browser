import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  getNutritionGradeColor,
  getFallbackImageUrl,
  formatNutritionValue,
} from "../../lib/utils";
import { formatWithFallback } from "../../lib/utils/fallback";
import { Button } from "../ui/button";
import { useTheme } from "../../lib/theme-context";
import { applyGlass } from "../../lib/glassmorphism";
import BarcodeImage from "./barcode-image";

/**
 * ProductDetailView component - Displays detailed product information
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - ProductDetailView component
 */
const ProductDetailView = ({ product, isLoading, className }) => {
  const { theme } = useTheme();
  // Early return for loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-8 animate-pulse", className)}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image skeleton */}
          <div className="w-full md:w-1/3 aspect-square bg-muted rounded-lg"></div>

          {/* Content skeleton */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-24 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Extract product data
  const {
    product_name,
    brands,
    image_url,
    image_front_url,
    image_front_small_url,
    ingredients_text,
    nutriments = {},
    nutrition_grades,
    ecoscore_grade,
    nova_group,
    categories_tags = [],
    labels_tags = [],
    countries_tags = [],
  } = product || {};

  // Format categories and labels
  const formattedCategories = categories_tags
    .map((tag) => tag.replace("en:", ""))
    .map((cat) => cat.split(":").pop().replace(/-/g, " "))
    .join(", ");

  const formattedLabels = labels_tags
    .map((tag) => tag.replace("en:", ""))
    .join(", ");

  // Nutrition facts
  const nutritionData = [
    { name: "Energy", value: nutriments.energy, unit: "kcal" },
    { name: "Fat", value: nutriments.fat, unit: "g" },
    { name: "Saturated Fat", value: nutriments["saturated-fat"], unit: "g" },
    { name: "Carbohydrates", value: nutriments.carbohydrates, unit: "g" },
    { name: "Sugars", value: nutriments.sugars, unit: "g" },
    { name: "Fiber", value: nutriments.fiber, unit: "g" },
    { name: "Proteins", value: nutriments.proteins, unit: "g" },
    { name: "Salt", value: nutriments.salt, unit: "g" },
    { name: "Sodium", value: nutriments.sodium, unit: "g" },
  ];

  // Get nutrition grade color
  const getNutritionBadgeClass = (grade) => {
    if (!grade) return "bg-gray-300";

    const gradeColors = {
      a: "bg-green-500",
      b: "bg-lime-500",
      c: "bg-yellow-500",
      d: "bg-orange-500",
      e: "bg-red-500",
    };

    return gradeColors[grade.toLowerCase()] || "bg-gray-300";
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Product header */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-1/3">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={
                image_url ||
                image_front_url ||
                image_front_small_url ||
                getFallbackImageUrl()
              }
              alt={product_name || "Food product"}
              className="object-contain w-full h-full"
              onError={(e) => {
                e.target.src = getFallbackImageUrl();
              }}
            />
          </div>
        </div>

        {/* Product info */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight">
              {formatWithFallback(product_name, { useInitials: true })}
            </h1>
            <p className="text-lg text-muted-foreground">
              {formatWithFallback(brands, { useInitials: true })}
            </p>
          </div>

          {/* Product scores */}
          <div className="flex flex-wrap gap-3">
            {nutrition_grades && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                    getNutritionBadgeClass(nutrition_grades)
                  )}
                >
                  {nutrition_grades.toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-medium">Nutrition Grade</p>
                  <p className="text-sm">{nutrition_grades.toUpperCase()}</p>
                </div>
              </div>
            )}

            {ecoscore_grade && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                  {ecoscore_grade.toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-medium">Eco Score</p>
                  <p className="text-sm">{ecoscore_grade.toUpperCase()}</p>
                </div>
              </div>
            )}

            {nova_group && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  {nova_group}
                </span>
                <div>
                  <p className="text-xs font-medium">NOVA Group</p>
                  <p className="text-sm">Processing Level {nova_group}</p>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Categories
            </h2>
            <p>{formatWithFallback(formattedCategories)}</p>
          </div>

          {/* Labels */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Labels
            </h2>
            {labels_tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {labels_tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                  >
                    {tag.replace("en:", "")}
                  </span>
                ))}
              </div>
            ) : (
              <p>
                {formatWithFallback("", { defaultText: "No labels available" })}
              </p>
            )}
          </div>

          {/* Barcode */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Barcode
            </h2>
            {/* Barcode Image */}
            <div className="mb-3">
              <BarcodeImage
                barcode={product._id}
                format="EAN13"
                height={80}
                className="max-w-[240px] bg-white p-3 rounded-md border"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                {product._id || "Unknown"}
              </span>
              <Link
                to={`/barcode`}
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                Search another barcode
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="space-y-8">
        {/* Ingredients */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Ingredients
          </h2>
          <div
            className={cn(
              "p-6 rounded-lg",
              applyGlass("card", theme, "bg-opacity-95 dark:bg-opacity-95")
            )}
          >
            <p className="whitespace-pre-line text-lg leading-relaxed">
              {ingredients_text || "No ingredients information available"}
            </p>
          </div>
        </div>

        {/* Nutrition facts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Nutrition Facts
          </h2>
          <div
            className={cn(
              "rounded-lg overflow-hidden",
              applyGlass("card", theme, "bg-opacity-95 dark:bg-opacity-95")
            )}
          >
            <table className="w-full">
              <thead className="bg-muted/20 dark:bg-muted/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">
                    Nutrient
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Amount per Serving
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10 dark:divide-muted/5">
                {nutritionData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatNutritionValue(item.value, item.unit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Back Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          variant="default"
          onClick={() => window.history.back()}
          className="shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Products
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailView;

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

/**
 * ProductDetailView component - Displays detailed product information with a modern design
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

  // Calculate nutrition score percentage for visualization
  const getNutritionPercentage = (value, max) => {
    if (!value || isNaN(value)) return 0;
    return Math.min(Math.round((value / max) * 100), 100);
  };

  // Max values for common nutrients (approximate daily values)
  const maxValues = {
    fat: 70, // g
    "saturated-fat": 20, // g
    carbohydrates: 300, // g
    sugars: 50, // g
    proteins: 50, // g
    salt: 6, // g
    sodium: 2.4, // g
    fiber: 30, // g
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Hero section with product image and basic info */}
      <div
        className={cn(
          "rounded-xl overflow-hidden relative",
          applyGlass("card", theme, "bg-opacity-90 dark:bg-opacity-90")
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Product image */}
          <div className="w-full md:w-2/5 p-6 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg border bg-white dark:bg-black/20 shadow-md">
              <img
                src={
                  image_url ||
                  image_front_url ||
                  image_front_small_url ||
                  getFallbackImageUrl()
                }
                alt={product_name || "Food product"}
                className="object-contain w-full h-full p-4"
                onError={(e) => {
                  e.target.src = getFallbackImageUrl();
                }}
              />
            </div>
          </div>

          {/* Product info */}
          <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight mb-2">
                {formatWithFallback(product_name, { useInitials: true })}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {formatWithFallback(brands, { useInitials: true })}
              </p>

              {/* Barcode display */}
              <div className="mb-6 p-4 bg-white/80 dark:bg-black/20 rounded-lg border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1">
                      Product Barcode
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                        {product._id || "Unknown"}
                      </span>
                      <Link
                        to={`/barcode`}
                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                      >
                        Search another
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1">
                    <BarcodeImage
                      barcode={product._id}
                      format="EAN13"
                      height={60}
                      className="max-w-full bg-white p-2 rounded-md border"
                    />
                  </div>
                </div>
              </div>

              {/* Product scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {nutrition_grades && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-white/50 dark:bg-white/5 border shadow-sm">
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white",
                        getNutritionBadgeClass(nutrition_grades)
                      )}
                    >
                      {nutrition_grades.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Nutrition Grade
                      </p>
                      <p className="text-base font-semibold">
                        {nutrition_grades.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                {ecoscore_grade && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-white/50 dark:bg-white/5 border shadow-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
                      {ecoscore_grade.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Eco Score
                      </p>
                      <p className="text-base font-semibold">
                        {ecoscore_grade.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                {nova_group && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-white/50 dark:bg-white/5 border shadow-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
                      {nova_group}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        NOVA Group
                      </p>
                      <p className="text-base font-semibold">
                        Processing Level {nova_group}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categories and labels */}
            <div className="mt-auto pt-4 border-t border-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-1">
                    Categories
                  </h2>
                  <p className="text-sm">
                    {formatWithFallback(formattedCategories)}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-1">
                    Labels
                  </h2>
                  {labels_tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {labels_tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors"
                        >
                          {tag.replace("en:", "")}
                        </span>
                      ))}
                      {labels_tags.length > 5 && (
                        <span className="inline-flex items-center rounded-full bg-muted/20 px-2 py-0.5 text-xs font-semibold">
                          +{labels_tags.length - 5} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">
                      {formatWithFallback("", {
                        defaultText: "No labels available",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed information in a single scrollable layout */}
      <div className="space-y-6">
        {/* Nutrition Facts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
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
            </CardTitle>
            <CardDescription>
              Nutritional information per serving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Visual nutrition bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutritionData
                  .filter((item) => item.name !== "Energy")
                  .map((item, index) => {
                    const nutrientKey = item.name
                      .toLowerCase()
                      .replace(" ", "-");
                    const maxValue =
                      maxValues[nutrientKey] ||
                      maxValues[item.name.toLowerCase()];
                    const percentage = getNutritionPercentage(
                      item.value,
                      maxValue
                    );

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                          <span className="text-sm font-bold">
                            {formatNutritionValue(item.value, item.unit)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              percentage > 80
                                ? "bg-red-500"
                                : percentage > 50
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {percentage}% of daily value
                        </p>
                      </div>
                    );
                  })}
              </div>

              {/* Energy value highlight */}
              <div className="p-4 rounded-lg bg-primary/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Energy</h3>
                  <p className="text-sm text-muted-foreground">
                    Calories per serving
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatNutritionValue(nutriments.energy, "kcal")}
                </div>
              </div>

              {/* Full nutrition table */}
              <div className="rounded-lg overflow-hidden border">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Nutrient
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-sm">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-sm">
                        % Daily Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/10">
                    {nutritionData.map((item, index) => {
                      const nutrientKey = item.name
                        .toLowerCase()
                        .replace(" ", "-");
                      const maxValue =
                        maxValues[nutrientKey] ||
                        maxValues[item.name.toLowerCase()];
                      const percentage = getNutritionPercentage(
                        item.value,
                        maxValue
                      );

                      return (
                        <tr
                          key={index}
                          className="hover:bg-muted/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm">{item.name}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatNutritionValue(item.value, item.unit)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {maxValue ? `${percentage}%` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
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
            </CardTitle>
            <CardDescription>
              Complete list of ingredients in this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/10 border">
              <p className="whitespace-pre-line text-lg leading-relaxed">
                {ingredients_text || "No ingredients information available"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Product Details
            </CardTitle>
            <CardDescription>
              Additional information about this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Brand
                  </h3>
                  <p className="text-lg font-medium">
                    {formatWithFallback(brands)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Categories
                  </h3>
                  <p>{formatWithFallback(formattedCategories)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Labels
                  </h3>
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
                      {formatWithFallback("", {
                        defaultText: "No labels available",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Countries
                  </h3>
                  <p>
                    {countries_tags.length > 0
                      ? countries_tags
                          .map((tag) => tag.replace("en:", ""))
                          .join(", ")
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Barcode
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                      {product._id || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <BarcodeImage
                    barcode={product._id}
                    format="EAN13"
                    height={80}
                    className="max-w-[240px] bg-white p-3 rounded-md border"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

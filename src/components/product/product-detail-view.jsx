import { useState } from "react";
import { cn } from "../../lib/utils";
import { getFallbackImageUrl, formatNutritionValue } from "../../lib/utils";
import { formatWithFallback } from "../../lib/utils/fallback";
import { Button } from "../ui/button";
import { useTheme } from "../../lib/theme-context";
import { applyGlass } from "../../lib/glassmorphism";
import BarcodeImage from "./barcode-image";
import { CheckCircle, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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
  const [copied, setCopied] = useState(false);

  // Copy barcode to clipboard
  const copyBarcode = () => {
    if (product?._id) {
      navigator.clipboard.writeText(product._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      b: "bg-green-500",
      c: "bg-green-500",
      d: "bg-green-500",
      e: "bg-green-500",
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
          "rounded-xl overflow-hidden relative mt-4",
          applyGlass("card", theme, "bg-opacity-90 dark:bg-opacity-90")
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Product image with nutrition grade chip */}
          <div className="w-full md:w-2/5 p-6 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg shadow-md">
              <img
                src={
                  image_url ||
                  image_front_url ||
                  image_front_small_url ||
                  getFallbackImageUrl() ||
                  "/placeholder.svg"
                }
                alt={product_name || "Food product"}
                className="object-contain w-full h-full p-4 bg-white dark:bg-black/20"
                onError={(e) => {
                  e.target.src = getFallbackImageUrl();
                }}
              />

              {/* Nutrition grade chip with icon */}
              {nutrition_grades && (
                <div className="absolute top-3 right-3">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md",
                      getNutritionBadgeClass(nutrition_grades) 
                    )}
                    title="Nutrition Grade"
                  >
                    <svg
                      fill="#ffffff"
                      height="24px"
                      width="24px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 378.928 378.928"
                      xml:space="preserve"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          id="XMLID_1375_"
                          d="M7.965,325.71c0.078,1.295,0.427,2.512,0.991,3.598c0.529,1.021,1.262,1.956,2.192,2.738 c0.122,0.104,0.247,0.203,0.375,0.3c11.251,8.624,38.103,11.699,59.52,11.699c2.297,0,4.633-0.034,6.941-0.103 c4.968-0.146,8.877-4.293,8.731-9.262s-4.307-8.898-9.261-8.73c-2.132,0.063-4.289,0.095-6.411,0.095 c-22.922,0-38.302-3.317-45.262-6.216l-7.151-220.16c2.277,0.861,4.76,1.662,7.45,2.403c13.311,3.665,30.85,5.684,49.389,5.684 c5.063,0,10.053-0.15,14.902-0.444l-3.548,116.575c-0.151,4.968,3.753,9.118,8.722,9.27c4.972,0.17,9.119-3.754,9.27-8.723 l3.621-118.978c5.947-0.888,11.478-2.022,16.422-3.384c2.698-0.743,5.188-1.548,7.471-2.412l-2.606,83.414 c-0.155,4.969,3.747,9.122,8.714,9.276c4.982,0.197,9.121-3.746,9.277-8.714l3.196-102.307c0.017-0.291,0.025-0.584,0.025-0.879 c0-7.645-5.566-13.835-16.544-18.4c-4.586-1.909-9.856,0.265-11.766,4.854c-1.909,4.59,0.265,9.857,4.854,11.767 c1.643,0.683,2.851,1.305,3.729,1.827c-3.609,2.142-11.133,4.751-22.217,6.652l2.308-75.82c0.151-4.968-3.753-9.118-8.722-9.27 c-4.946-0.128-9.119,3.755-9.27,8.723l-1.306,42.91c-5.384-0.364-10.915-0.549-16.534-0.549c-18.539,0-36.078,2.019-49.389,5.685 C8.829,63.58,0.056,70.824,0,80.36c0,0.052,0,0.104,0,0.156c0.001,0.255,0.008,0.508,0.022,0.76l7.929,244.119 C7.954,325.501,7.958,325.605,7.965,325.71z M75.467,71.145c5.45,0,10.799,0.186,15.986,0.555l-0.534,17.55 c-4.78,0.323-9.935,0.506-15.452,0.506c-30.077,0-49.383-5.435-55.821-9.305C26.084,76.581,45.391,71.145,75.467,71.145z M41.299,217.208c-3.515-3.515-3.514-9.213,0.001-12.728c3.516-3.513,9.214-3.514,12.728,0.001l3.269,3.27 c3.515,3.515,3.514,9.213-0.001,12.728c-1.757,1.757-4.06,2.636-6.363,2.636c-2.304,0-4.607-0.879-6.364-2.637L41.299,217.208z M207.794,104.228c1.429-10.193,6.736-20.885,11.868-31.225c12.053-24.283,14.133-32.772,3.671-38.57 c-4.348-2.41-5.918-7.888-3.509-12.235c2.409-4.347,7.888-5.915,12.234-3.509c12.108,6.711,17.508,17.435,15.615,31.011 c-1.426,10.227-6.745,20.943-11.889,31.307c-12.012,24.201-14.094,32.655-3.726,38.402c4.347,2.41,5.918,7.888,3.508,12.235 c-1.644,2.965-4.714,4.639-7.88,4.639c-1.476,0-2.973-0.364-4.355-1.131C211.269,128.465,205.896,117.771,207.794,104.228z M125.414,361.879c1.068,4.854-2.001,9.656-6.855,10.725c-12.502,2.751-28.859,4.266-46.058,4.266 c-23.595,0-53.145-3.02-65.32-11.493c-4.08-2.84-5.085-8.448-2.245-12.528c2.839-4.079,8.449-5.084,12.528-2.245 c5.758,4.008,27.003,8.267,55.037,8.267c15.937,0,30.92-1.365,42.19-3.846C119.544,353.96,124.346,357.025,125.414,361.879z M372.192,253.614c-2.105-1.823-4.937-2.57-7.667-2.02c-6.877,1.384-13.934,2.658-21.141,3.821c-1.602-2.726-3.55-5.24-5.831-7.521 l-15.847-15.846c14.773-4.678,28.455-13.849,38.946-26.877c21.39-26.564,24.282-62.652,7.198-89.801 c-1.068-1.698-2.672-2.99-4.559-3.672c-30.166-10.896-64.806-0.373-86.197,26.191c-19.931,24.752-23.805,57.768-10.422,84.117 l-1.867,2.318c-3.118,3.871-2.506,9.537,1.365,12.654c3.872,3.119,9.538,2.505,12.654-1.365l1.867-2.317 c6.288,1.638,12.709,2.392,19.119,2.311l22.8,22.799c-30.18,3.843-62.477,5.836-95.317,5.836c-32.84,0-65.138-1.994-95.317-5.836 l81.335-81.334c6.176-6.176,15.857-7.542,23.545-3.319c4.355,2.393,9.828,0.802,12.221-3.556c2.393-4.356,0.801-9.828-3.555-12.222 c-14.66-8.051-33.14-5.433-44.939,6.369l-83.551,83.55c-2.279,2.28-4.227,4.795-5.828,7.52c-7.206-1.163-14.263-2.438-21.14-3.821 c-2.73-0.546-5.561,0.196-7.667,2.02s-3.248,4.519-3.095,7.3c2.645,47.948,42.008,87.876,96.435,103.581 c-0.421,1.041-0.653,2.179-0.653,3.371c0,4.971,4.029,9,9,9H270.5c4.971,0,9-4.029,9-9c0-1.192-0.231-2.33-0.652-3.371 c54.426-15.705,93.792-55.633,96.439-103.581C375.44,258.132,374.297,255.437,372.192,253.614z M293.529,217.356l36.06-44.783 c3.118-3.871,2.506-9.537-1.365-12.654c-3.87-3.117-9.537-2.506-12.654,1.365l-36.06,44.783 c-6.006-18.569-1.915-40.096,11.605-56.887c15.862-19.699,40.861-28.106,63.089-21.527c11.173,20.315,8.29,46.533-7.57,66.23 c-11.165,13.864-26.854,22.137-42.92,23.525C303.045,217.382,296.25,217.624,293.529,217.356z M318.341,325.619 c-24.5,18.078-56.834,28.034-91.047,28.034s-66.547-9.956-91.047-28.034c-20.002-14.759-32.974-33.628-37.395-54.042 c5.285,0.94,10.653,1.82,16.102,2.64c0.161,0.028,0.321,0.053,0.481,0.072c34.942,5.228,73.056,7.955,111.859,7.955 c38.806,0,76.922-2.729,111.868-7.956c0.154-0.02,0.308-0.043,0.462-0.069c5.452-0.82,10.826-1.7,16.113-2.642 C351.315,291.991,338.343,310.86,318.341,325.619z M64.629,184.984c-1.757,1.757-4.06,2.635-6.363,2.635 c-2.304,0-4.607-0.879-6.365-2.637c-3.514-3.516-3.514-9.214,0.002-12.729l3.271-3.27c3.515-3.515,9.214-3.513,12.728,0.002 c3.514,3.516,3.514,9.214-0.002,12.729L64.629,184.984z M41.409,145.746l-3.269-3.27c-3.515-3.515-3.514-9.213,0.001-12.728 c3.515-3.514,9.213-3.515,12.728,0.001l3.269,3.27c3.515,3.515,3.514,9.213-0.001,12.728c-1.757,1.757-4.06,2.636-6.363,2.636 C45.469,148.382,43.166,147.503,41.409,145.746z"
                        ></path>{" "}
                      </g>
                    </svg>
                    <span className="font-bold text-white">
                      {nutrition_grades.toUpperCase() || "N/A"}
                    </span>
                  </div>
                </div>
              )}
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

              {/* Barcode display with copy functionality */}
              <div className="mb-6 p-4 bg-white/80 dark:bg-black/20 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1">
                      Product Barcode
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                        {product._id || "Unknown"}
                      </span>
                      <button
                        onClick={copyBarcode}
                        className="p-1 rounded-md hover:bg-muted/50 transition-colors"
                        aria-label="Copy barcode"
                        title={copied ? "Copied!" : "Copy barcode"}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <BarcodeImage
                      barcode={product._id}
                      format="EAN13"
                      height={60}
                      className="max-w-full bg-white p-2 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Eco score and Nova group chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ecoscore_grade && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white shadow-sm"
                  title="Environmental impact score"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M2 22a10 10 0 1 1 20 0" />
                    <path d="M12 13V2" />
                    <path d="m9 5 3-3 3 3" />
                    <path d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span className="font-semibold">
                    Eco {ecoscore_grade.toUpperCase()}
                  </span>
                </div>
              )}

              {nova_group && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 text-white shadow-sm"
                  title="Food processing level"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                  <span className="font-semibold">NOVA {nova_group}</span>
                </div>
              )}
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
                    <button
                      onClick={copyBarcode}
                      className="p-1 rounded-md hover:bg-muted/50 transition-colors"
                      aria-label="Copy barcode"
                      title={copied ? "Copied!" : "Copy barcode"}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <BarcodeImage
                    barcode={product._id}
                    format="EAN13"
                    height={80}
                    className="max-w-[240px] bg-white p-3 rounded-md"
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

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { getNutritionGradeColor, getFallbackImageUrl } from "../../lib/utils";
import { useTheme } from "../../lib/theme-context";
import { applyGlass } from "../../lib/glassmorphism";

/**
 * ProductCardNew component - Redesigned product card with modern styling
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - ProductCardNew component
 */
const ProductCardNew = ({ product, className }) => {
  const { theme } = useTheme();
  // Extract product data
  const {
    id,
    product_name,
    brands,
    image_url,
    image_front_url,
    image_front_small_url,
    categories_tags = [],
    nutrition_grades,
    ingredients_text,
  } = product;

  // Format category for display
  const category = categories_tags[0]?.replace("en:", "") || "UN";
  const formattedCategory = category.split(":").pop().replace(/-/g, " ");

  // Format brand name
  const brandName = brands || "UN";

  // Truncate long text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "No information available";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Get nutrition grade badge color and icon
  const getNutritionBadgeInfo = (grade) => {
    if (!grade) return { color: "bg-gray-300", icon: "?" };

    const gradeInfo = {
      a: { color: "bg-green-500" },
      b: { color: "bg-green-500" },
      c: { color: "bg-green-500" },
      d: { color: "bg-green-500" },
      e: { color: "bg-green-500" },
    };

    return (
      gradeInfo[grade.toLowerCase()] || { color: "bg-gray-300", icon: "?" }
    );
  };

  // Get nutrition grade badge class
  const getNutritionBadgeClass = (grade) => {
    if (!grade) return "bg-gray-300";
    const gradeInfo = getNutritionBadgeInfo(grade);
    return gradeInfo.color;
  };

  return (
    <Link
      to={`/product/${id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-md relative",
        applyGlass("card", theme, "hover:translate-y-[-2px]"),
        className
      )}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110 opacity-100"
          style={{
            backgroundImage: `url(${
              image_url ||
              image_front_url ||
              image_front_small_url ||
              getFallbackImageUrl()
            })`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Original image container */}
        <div className="relative aspect-square flex items-center justify-center bg-muted/20">
          <img
            src={
              image_url ||
              image_front_url ||
              image_front_small_url ||
              getFallbackImageUrl()
            }
            alt={product_name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              if (e.target.src !== getFallbackImageUrl()) {
                e.target.src = getFallbackImageUrl();
              }
            }}
          />
        </div>

        {/* Nutrition grade badge */}
        {nutrition_grades && (
          <div className="absolute top-3 right-3">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full shadow-md",
                getNutritionBadgeClass(nutrition_grades)
              )}
              title="Nutrition Grade"
            >
              <svg
                fill="#ffffff"
                height="14px"
                width="14px"
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

      {/* Product Info */}
      <div className="flex flex-1 flex-col space-y-3 p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
          {formattedCategory}
        </p>

        {/* Product name */}
        <h3 className="font-medium leading-snug line-clamp-1 truncate">
          {product_name || "UN"}
        </h3>

        {/* Ingredients */}
        {ingredients_text && (
          <p className="text-sm text-muted-foreground leading-normal line-clamp-2 min-h-[2.5rem]">
            {ingredients_text}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCardNew;

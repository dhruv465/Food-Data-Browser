import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import BarcodeImage from "./barcode-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ProductDetailView = ({ product, isLoading, className }) => {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-lg font-medium">Loading product details...</p>
      </div>
    );
  }

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
    _id: barcode,
  } = product || {};

  const formattedCategories = categories_tags
    .map((tag) => tag.replace("en:", ""))
    .map((cat) => cat.split(":").pop().replace(/-/g, " "))
    .join(", ");

  const formattedLabels = labels_tags
    .map((tag) => tag.replace("en:", ""))
    .join(", ");

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

  const scoreVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

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

  const getNutritionPercentage = (value, max) => {
    if (!value || isNaN(value)) return 0;
    return Math.min(Math.round((value / max) * 100), 100);
  };

  const handleShowBarcode = () => {
    setShowBottomSheet(true);
  };

  const tabVariants = {
    inactive: { opacity: 0.6, y: 5 },
    active: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const barVariants = {
    initial: { width: 0 },
    animate: (percentage) => ({
      width: `${percentage}%`,
      transition: { duration: 1, ease: "easeOut" },
    }),
  };

  return (
    <div
      className={cn(
        "relative min-h-screen bg-gradient-to-b from-background to-background/50",
        className
      )}
    >
      {/* Sticky header that shows on scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: scrollPosition > 100 ? 1 : 0,
          y: scrollPosition > 100 ? 0 : -50,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </Button>
            <h2 className="font-semibold truncate max-w-xs">
              {formatWithFallback(product_name, { useInitials: true })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {nutrition_grades && (
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-bold text-white text-xs",
                  getNutritionBadgeClass(nutrition_grades)
                )}
              >
                {nutrition_grades.toUpperCase()}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleShowBarcode}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              Barcode
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Hero section with image and basic info */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 pt-8 pb-0">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
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

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="relative aspect-square w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />

                <motion.img
                  src={
                    image_url ||
                    image_front_url ||
                    image_front_small_url ||
                    getFallbackImageUrl()
                  }
                  alt={product_name || "Food product"}
                  className="object-contain w-full h-full p-8"
                  onError={(e) => {
                    e.target.src = getFallbackImageUrl();
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <motion.h1
                  className="text-4xl sm:text-5xl font-bold mb-2 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {formatWithFallback(product_name, { useInitials: true })}
                </motion.h1>
                <motion.p
                  className="text-xl text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {formatWithFallback(brands, { useInitials: true })}
                </motion.p>
              </div>

              <motion.div
                className="flex flex-wrap gap-4"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {nutrition_grades && (
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-white/5 border shadow-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <span
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white",
                        getNutritionBadgeClass(nutrition_grades)
                      )}
                    >
                      {nutrition_grades.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Nutrition Grade
                      </p>
                      <p className="text-lg font-semibold">
                        {nutrition_grades.toUpperCase()}
                      </p>
                    </div>
                  </motion.div>
                )}

                {ecoscore_grade && (
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-white/5 border shadow-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
                      {ecoscore_grade.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Eco Score
                      </p>
                      <p className="text-lg font-semibold">
                        {ecoscore_grade.toUpperCase()}
                      </p>
                    </div>
                  </motion.div>
                )}

                {nova_group && (
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-white/5 border shadow-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                      {nova_group}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        NOVA Group
                      </p>
                      <p className="text-lg font-semibold">
                        Processing Level {nova_group}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="mt-8 flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button
                  onClick={handleShowBarcode}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    View Barcode
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-primary/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </Button>

                <div className="ml-4 text-sm">
                  <span className="block text-muted-foreground">Barcode</span>
                  <span className="font-medium">{barcode || "Unknown"}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Category/Label pills */}
      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories_tags.slice(0, 5).map((tag, index) => (
            <motion.span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1 text-sm font-medium transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              {tag.replace("en:", "").split(":").pop().replace(/-/g, " ")}
            </motion.span>
          ))}
          {labels_tags.slice(0, 3).map((tag, index) => (
            <motion.span
              key={tag}
              className="inline-flex items-center rounded-full bg-secondary/10 dark:bg-secondary/20 px-3 py-1 text-sm font-medium transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              {tag.replace("en:", "")}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Tabbed content */}
      <motion.div
        className="container mx-auto px-4 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-16 z-10 backdrop-blur-md bg-background/50 py-2 -mx-4 px-4 border-b">
            <TabsList className="w-full grid grid-cols-3 mb-0">
              <motion.div
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === "nutrition" ? "active" : "inactive"}
              >
                <TabsTrigger value="nutrition" className="text-base w-full">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Nutrition
                </TabsTrigger>
              </motion.div>

              <motion.div
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === "ingredients" ? "active" : "inactive"}
              >
                <TabsTrigger value="ingredients" className="text-base w-full">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Ingredients
                </TabsTrigger>
              </motion.div>

              <motion.div
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === "details" ? "active" : "inactive"}
              >
                <TabsTrigger value="details" className="text-base w-full">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Details
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === "nutrition" && (
                <TabsContent value="nutrition" asChild>
                  <motion.div
                    key="nutrition"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="space-y-8">
                      {/* Energy value highlight */}
                      <motion.div
                        className="p-6 rounded-xl bg-primary/10 flex flex-col md:flex-row items-center justify-between"
                        variants={itemVariants}
                      >
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-bold">Energy</h3>
                          <p className="text-sm text-muted-foreground">
                            Calories per serving
                          </p>
                        </div>
                        <div className="text-4xl font-bold text-primary">
                          {formatNutritionValue(nutriments.energy, "kcal")}
                        </div>
                      </motion.div>

                      {/* Nutrition bars */}
                      <motion.div className="space-y-6" variants={itemVariants}>
                        <h3 className="text-xl font-bold">Nutrition Facts</h3>

                        <motion.div
                          className="grid grid-cols-1 gap-6"
                          variants={contentVariants}
                        >
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
                                <motion.div
                                  key={index}
                                  className="space-y-2"
                                  variants={itemVariants}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      {item.name}
                                    </span>
                                    <span className="text-sm font-bold">
                                      {formatNutritionValue(
                                        item.value,
                                        item.unit
                                      )}
                                    </span>
                                  </div>
                                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative">
                                    <motion.div
                                      className={cn(
                                        "h-full rounded-full absolute left-0 top-0",
                                        percentage > 80
                                          ? "bg-red-500"
                                          : percentage > 50
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      )}
                                      custom={percentage}
                                      variants={barVariants}
                                      initial="initial"
                                      animate="animate"
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {percentage}% of daily value
                                  </p>
                                </motion.div>
                              );
                            })}
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "ingredients" && (
                <TabsContent value="ingredients" asChild>
                  <motion.div
                    key="ingredients"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="space-y-4">
                      <motion.h3
                        className="text-xl font-bold flex items-center gap-2"
                        variants={itemVariants}
                      >
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
                      </motion.h3>

                      <motion.div
                        className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                        variants={itemVariants}
                      >
                        {ingredients_text ? (
                          <motion.p
                            className="whitespace-pre-line text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                          >
                            {ingredients_text}
                          </motion.p>
                        ) : (
                          <motion.div
                            className="flex flex-col items-center justify-center py-12"
                            variants={itemVariants}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-16 w-16 text-muted-foreground mb-4"
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
                            <p className="text-lg text-center text-muted-foreground">
                              No ingredients information available.
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "details" && (
                <TabsContent value="details" asChild>
                  <motion.div
                    key="details"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="space-y-6">
                      <motion.div className="space-y-6" variants={itemVariants}>
                        <h3 className="text-xl font-bold flex items-center gap-2">
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
                          Product Information
                        </h3>

                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                          variants={contentVariants}
                        >
                          {/* Categories */}
                          <motion.div
                            className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                            variants={itemVariants}
                          >
                            <h4 className="font-medium text-muted-foreground mb-2">
                              Categories
                            </h4>
                            <p className="text-lg">
                              {formattedCategories || "No categories available"}
                            </p>
                          </motion.div>

                          {/* Labels */}
                          <motion.div
                            className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                            variants={itemVariants}
                          >
                            <h4 className="font-medium text-muted-foreground mb-2">
                              Labels
                            </h4>
                            <p className="text-lg">
                              {formattedLabels || "No labels available"}
                            </p>
                          </motion.div>

                          {/* Countries */}
                          <motion.div
                            className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                            variants={itemVariants}
                          >
                            <h4 className="font-medium text-muted-foreground mb-2">
                              Countries
                            </h4>
                            <p className="text-lg">
                              {countries_tags.length > 0
                                ? countries_tags
                                    .map((tag) => tag.replace("en:", ""))
                                    .join(", ")
                                : "No country information available"}
                            </p>
                          </motion.div>

                          {/* Barcode */}
                          <motion.div
                            className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                            variants={itemVariants}
                          >
                            <h4 className="font-medium text-muted-foreground mb-2">
                              Barcode
                            </h4>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-mono">
                                {barcode || "Unknown"}
                              </p>
                              <Button
                                size="sm"
                                onClick={handleShowBarcode}
                                variant="outline"
                              >
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
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                  />
                                </svg>
                                View
                              </Button>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Score Explanations */}
                        <motion.div
                          className="mt-8 space-y-6"
                          variants={itemVariants}
                        >
                          <h3 className="text-xl font-bold flex items-center gap-2">
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
                            Scoring Explanations
                          </h3>

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            variants={contentVariants}
                          >
                            {/* Nutri-Score Explanation */}
                            {nutrition_grades && (
                              <motion.div
                                className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                                variants={itemVariants}
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span
                                    className={cn(
                                      "flex h-12 w-12 items-center justify-center rounded-full font-bold text-white",
                                      getNutritionBadgeClass(nutrition_grades)
                                    )}
                                  >
                                    {nutrition_grades.toUpperCase()}
                                  </span>
                                  <h4 className="font-bold text-lg">
                                    Nutri-Score
                                  </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  The Nutri-Score rates products from A
                                  (healthiest) to E (least healthy) based on
                                  nutritional quality. It considers beneficial
                                  elements (protein, fiber) and elements to
                                  limit (calories, saturated fat, sugar, salt).
                                </p>
                              </motion.div>
                            )}

                            {/* Eco-Score Explanation */}
                            {ecoscore_grade && (
                              <motion.div
                                className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                                variants={itemVariants}
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                                    {ecoscore_grade.toUpperCase()}
                                  </span>
                                  <h4 className="font-bold text-lg">
                                    Eco-Score
                                  </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  The Eco-Score indicates the environmental
                                  impact from A (lowest impact) to E (highest
                                  impact). It evaluates the entire lifecycle
                                  including production, transportation, and
                                  packaging.
                                </p>
                              </motion.div>
                            )}

                            {/* NOVA Explanation */}
                            {nova_group && (
                              <motion.div
                                className="p-6 rounded-xl bg-muted/10 border shadow-sm"
                                variants={itemVariants}
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                                    {nova_group}
                                  </span>
                                  <h4 className="font-bold text-lg">
                                    NOVA Group
                                  </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  NOVA classifies foods by processing level from
                                  1 (unprocessed/minimally processed) to 4
                                  (ultra-processed). Lower numbers generally
                                  indicate healthier, more natural foods with
                                  fewer additives.
                                </p>
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>

      {/* Barcode Bottom Sheet */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBottomSheet(false)}
            />

            <motion.div
              className="fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-auto bg-background rounded-t-xl p-6 shadow-xl z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="absolute top-3 left-0 right-0 flex justify-center">
                <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
              </div>

              <div className="mb-8 mt-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Product Barcode</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBottomSheet(false)}
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <BarcodeImage barcode={barcode} />

                <div className="text-center">
                  <p className="text-lg font-mono mb-2">{barcode}</p>
                  <p className="text-sm text-muted-foreground">
                    Scan this barcode to find this product again
                  </p>
                </div>

                <Button
                  className="mt-6"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(barcode);
                      // Would implement a toast notification here in a real app
                    } catch (err) {
                      console.error("Failed to copy barcode", err);
                    }
                  }}
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy Barcode
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailView;

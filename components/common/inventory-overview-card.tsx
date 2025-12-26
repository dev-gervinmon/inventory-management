"use client";

import { useState } from "react";

interface InventoryOverviewCardProps {
  totalProducts: number;
  inStockCount: number;
  inStockPercentage: number;
  lowStockCount: number;
  lowStockPercentage: number;
  outOfStockCount: number;
  outOfStockPercentage: number;
  criticalStockCount: number;
}

export default function InventoryOverviewCard({
  totalProducts,
  inStockCount,
  inStockPercentage,
  lowStockPercentage,
  outOfStockPercentage,
  criticalStockCount,
}: InventoryOverviewCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 col-span-2 lg:col-span-2 flex flex-col justify-between">
      <button
        className={`flex items-center justify-between w-full focus:outline-none transition-colors duration-150 rounded-md ${
          open ? "bg-gray-100" : "hover:bg-gray-50"
        } cursor-pointer px-1 py-2 sm:px-2`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="stock-overview-details"
        type="button"
      >
        <span className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900">
          Inventory Overview
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="mt-2 flex flex-row flex-wrap gap-2 sm:mt-4 sm:flex-row sm:gap-6 md:gap-8 lg:gap-10 items-stretch justify-between">
        {/* Total Products */}
        <div className="flex-1 min-w-[90px] flex flex-col items-center text-center px-1 py-1">
          <span className="p-1 sm:p-2 bg-blue-50 rounded-lg text-blue-600 text-lg sm:text-xl mb-0.5">
            📦
          </span>
          <span className="text-[10px] sm:text-xs text-gray-700 font-semibold">
            Total Products
          </span>
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5">
            {totalProducts}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">All products</span>
        </div>
        {/* In Stock */}
        <div className="flex-1 min-w-[90px] flex flex-col items-center text-center px-1 py-1">
          <span className="p-1 sm:p-2 bg-green-50 rounded-lg text-green-600 text-lg sm:text-xl mb-0.5">
            ✓
          </span>
          <span className="text-[10px] sm:text-xs text-gray-700 font-semibold">
            In Stock
          </span>
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-green-600 mt-0.5">
            {inStockCount}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">
            {inStockPercentage}% of inventory
          </span>
        </div>
        {/* Critical Stock */}
        <div className="flex-1 min-w-[90px] flex flex-col items-center text-center px-1 py-1">
          <span className="p-1 sm:p-2 bg-red-50 rounded-lg text-red-600 text-lg sm:text-xl mb-0.5">
            !
          </span>
          <span className="text-[10px] sm:text-xs text-gray-700 font-semibold">
            Critical Stock
          </span>
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-red-600 mt-0.5">
            {criticalStockCount}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">
            Low or out of stock
          </span>
        </div>
      </div>
      {open && (
        <div
          id="stock-overview-details"
          className="mt-3 sm:mt-6 border-t pt-2 sm:pt-4"
        >
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-4">
            Stock Status
          </h3>
          <div className="space-y-2 sm:space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    In Stock
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {inStockPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-green-500 h-1.5 sm:h-2 rounded-full"
                  style={{ width: `${inStockPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Low Stock
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {lowStockPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-yellow-500 h-1.5 sm:h-2 rounded-full"
                  style={{ width: `${lowStockPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Out of Stock
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {outOfStockPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-red-500 h-1.5 sm:h-2 rounded-full"
                  style={{ width: `${outOfStockPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

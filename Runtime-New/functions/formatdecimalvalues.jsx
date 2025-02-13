import React from "react";

export const formatDecimalValue = (value) => {
  // Handle NaV (Not a Value) case
  if (value === "NaV") return "NaV";

  // Check if the value is a numeric string
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const numValue = parseFloat(value);

    // Use scientific notation for very small or large numbers
    if (Math.abs(numValue) < 0.0001 || Math.abs(numValue) > 1000) {
      return numValue.toExponential(4);
    }

    // For normal numbers, show 4 decimal places
    return numValue.toFixed(4);
  }

  // If not a valid number, return original value
  return value;
};

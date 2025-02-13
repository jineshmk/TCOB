import React from "react";

export const combineTraceEntries = (traceEntries) => {
  if (!Array.isArray(traceEntries)) {
    throw new TypeError("Expected an array of trace entries");
  }

  const combinedEntries = [];

  // Group entries by time
  const timeGroups = traceEntries.reduce((acc, entry) => {
    if (!acc[entry.time]) {
      acc[entry.time] = [];
    }
    acc[entry.time].push(entry);
    return acc;
  }, {});

  Object.keys(timeGroups).forEach((time) => {
    const entriesAtTime = timeGroups[time];
    const obj = entriesAtTime[0].obj;
    const variable = entriesAtTime[0].variable;

    // Filter out "NaV" values
    const filteredEntries = entriesAtTime.filter(
      (entry) => entry.value !== "NaV",
    );

    const uniqueValues = [
      ...new Set(filteredEntries.map((entry) => entry.value)),
    ];

    // If only one unique value exists, use it directly; otherwise, join distinct ones
    const combinedValue =
      uniqueValues.length === 1 ? uniqueValues[0] : uniqueValues.join("_");

    combinedEntries.push({
      time: time,
      value: combinedValue,
      obj,
      variable,
    });
  });

  return combinedEntries;
};

export const SpecialcombineTraceEntries = (traceEntries) => {
  const combinedEntries = [];

  const timeGroups = traceEntries.reduce((acc, entry) => {
    if (!acc[entry.time]) {
      acc[entry.time] = [];
    }
    acc[entry.time].push(entry);
    return acc;
  }, {});

  Object.keys(timeGroups).forEach((time) => {
    const entriesAtTime = timeGroups[time];

    const uniqueValues = [
      ...new Set(
        entriesAtTime.map((entry) => {
          if (entry.value === "NaV") {
            return "";
          } else {
            return entry.value;
          }
        }),
      ),
    ];

    const combinedValue =
      uniqueValues.length > 1 ? uniqueValues.join("_") : uniqueValues[0];

    if (combinedValue.includes("NaV")) {
      combinedValue.replace("NaV", "");
    }

    console.log(combinedValue);

    combinedEntries.push({
      value: combinedValue,
      time: time,
    });
  });

  console.log(combinedEntries);
  return combinedEntries;
};

export const removeConsecutiveDuplicates = (entries) => {
  const filteredEntries = [];
  if (entries.indexOf("P") == -1) {
    for (let i = 0; i < entries.length; i++) {
      if (i === 0 || i === 1 || entries[i].value !== entries[i - 2].value) {
        filteredEntries.push(entries[i]);
      }
    }
  } else {
    for (let i = 0; i < entries.length; i++) {
      // Always push the first entry; then, for subsequent entries,
      // only push if its value is different from the previous entry's value.

      if (i === 0 || entries[i].value !== entries[i - 1].value) {
        filteredEntries.push(entries[i]);
      }
    }
  }
  return filteredEntries;
};

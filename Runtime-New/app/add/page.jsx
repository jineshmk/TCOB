"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFileContentStore, useSelectedVArrayStore } from "@/data/data";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";

const parseFileContent = (content) => {
  const lines = content.split("\n");
  const traceEntries = [];

  const tracePattern =
    /Time\s*=\s*(\d+):\s*Obj\s*=\s*([\w\[\]]+):\s*Var\s*=\s*([\w\d]+):\s*Val\s*=\s*([^\s]+)/;

  lines.forEach((line) => {
    const match = line.match(tracePattern);
    if (match) {
      const [_, time, obj, variable, value] = match;
      traceEntries.push({
        time,
        obj,
        variable,
        value: formatDecimalValue(value),
      });
    }
  });

  const uniqueKeys = [
    ...new Set(traceEntries.map((entry) => `${entry.obj}.${entry.variable}`)),
  ];

  return uniqueKeys;
};

const LogParser = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState("");
  const [uniqgroupedData, setUniqGroupedData] = useState([]);
  const { fileContent } = useFileContentStore();
  const { selectedVArray, setSelectedVArray } = useSelectedVArrayStore();

  useEffect(() => {
    if (fileContent) {
      setUniqGroupedData(parseFileContent(fileContent));
    }
  }, [fileContent]);

  const handleAddToListData = () => {
    if (selectedKey && !selectedData.includes(selectedKey)) {
      setSelectedData((prev) => [...prev, selectedKey]);
    }
  };

  const handleRemoveFromList = (keyToRemove) => {
    setSelectedData((prev) => prev.filter((key) => key !== keyToRemove));
  };

  const handleGraph = () => {
    setSelectedVArray(selectedData);
    console.log(`Selected Graph: ${selectedGraph}`);
    console.log(`Selected Data: ${selectedData}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h1 className="text-xl font-bold text-yellow-700 text-center mb-6">
          TCOB Trace Visualization
        </h1>

        {/* Select Variables */}
        <div className="mb-4">
          <label
            htmlFor="key-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Variables
          </label>
          <div className="flex flex-col">
            <select
              id="key-select"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="block w-full px-3 py-1 border rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Variable --</option>
              {uniqgroupedData.map((key, index) => (
                <option key={index} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddToListData}
              className="bg-[#2e5380] text-white px-3 py-1 rounded-md hover:bg-blue-600 mt-2"
            >
              Add Variable
            </button>
          </div>
        </div>

        {/* Selected Variables */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Variables
          </label>
          <ul className="bg-gray-50 p-2 border rounded-md max-h-32 overflow-auto">
            {selectedData.map((key, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-1 bg-gray-200 rounded-md my-1"
              >
                <span className="text-gray-700">{key}</span>
                <button
                  onClick={() => handleRemoveFromList(key)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &#10005;
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Select Graph Type */}
        <div className="mb-4">
          <label
            htmlFor="graph-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Graph Type
          </label>
          <select
            id="graph-select"
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Diagram --</option>
            <option value="uml">PlantUML Graph</option>
            <option value="abs3">Abstract Graph</option>
            <option value="line">Line Graph</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Select the variables and the graph model, and click on the submit
            button.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            onClick={() => console.log("Navigate to Home")}
          >
            Goto Home
          </button>
          <button
            onClick={handleGraph}
            className="bg-[#418258] text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <Link href={`/render${selectedGraph || "uml"}`}>Submit</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogParser;

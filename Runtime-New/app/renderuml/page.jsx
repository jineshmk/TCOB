"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { useFileContentStore, useSelectedVArrayStore } from "@/data/data";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";

const findMaxValueLength = (data) => {
  let maxLength = 0;

  // Iterate through each entry
  data.forEach((entry) => {
    if (entry?.value) {
      let valueArray;
      try {
        valueArray =
          typeof entry.value === "string"
            ? JSON.parse(entry.value)
            : entry.value;
      } catch (e) {
        console.warn("Could not parse value:", entry.value);
        return;
      }

      // Update maxLength if current value array is longer
      if (Array.isArray(valueArray) && valueArray.length > maxLength) {
        maxLength = valueArray.length;
      }
    }
  });

  return maxLength;
};

export default function TCOBTraceVisualization() {
  // State management for component
  const { fileContent } = useFileContentStore();
  const { getSelectedVArray } = useSelectedVArrayStore();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [property, setProperty] = useState("");
  const [uniqueObjectsAndValue, setUniqueObjectsAndValue] = useState([]);
  const [traceEntries, setTraceEntries] = useState([]);
  const [propertyResult, setPropertyResult] = useState("");
  const [isPropertyValid, setIsPropertyValid] = useState(false);
  const textareaRef = useRef(null);

  // Memoize the parseFileContent function to prevent unnecessary recreations
  const parseFileContent = useCallback((content) => {
    const selectedEntries = getSelectedVArray() || [];
    const lines = content.split("\n");
    const entries = [];

    // Regular expression to match trace entry format
    const tracePattern =
      /Time\s*=\s*(\d+):\s*Obj\s*=\s*([\w\[\]]+):\s*Var\s*=\s*([\w\d]+):\s*Val\s*=\s*([^\s]+)/;

    // Parse each line and extract trace
    lines.forEach((line) => {
      const match = line.match(tracePattern);
      if (match) {
        const [_, time, obj, variable, value] = match;
        if (value === "NaV") return;

        // Check if "obj.variable" exists in selectedEntries
        const objVarKey = `${obj}.${variable}`;

        if (
          selectedEntries.includes(objVarKey) ||
          selectedEntries.length === 0
        ) {
          entries.push({
            time,
            obj,
            variable,
            value: formatDecimalValue(value),
          });
        }
      }
    });
    const uniqueCombinations = entries
      .map((entry) => entry.obj + "." + entry.variable)
      .filter((variable, index, self) => self.indexOf(variable) === index);
    setUniqueObjectsAndValue(uniqueCombinations);
    return entries; // Return only the filtered entries
  }, []);

  // Separate function to create nodes and edges for better organization
  const createNodesAndEdges = useCallback((entries) => {
    if (!entries || entries.length === 0) {
      console.warn("No entries found for nodes!");
      return;
    }
    const parsedNodes = [];
    const parsedEdges = [];

    // Create start node
    const startNode = {
      id: "start",
      type: "default",
      position: { x: -330, y: -200 },
      data: { label: "" },
      style: {
        backgroundColor: "#000000",
        padding: "20px",
        borderRadius: "50px",
        width: "40px",
      },
      draggable: false,
    };
    parsedNodes.push(startNode);

    // Group entries by time for organized visualization
    const timeGroupedEntries = entries.reduce((acc, entry) => {
      if (!acc[entry.time]) acc[entry.time] = [];
      acc[entry.time].push(entry);
      return acc;
    }, {});
    // Create nodes for each time point
    Object.entries(timeGroupedEntries).forEach(([time, timeEntries], index) => {
      const nodeId = `time-${time}`;
      const lengthhere = timeEntries.length;

      let x;
      if (timeEntries[0].obj == "P") {
        const maxLength = Math.max(
          ...Object.values(timeGroupedEntries).map((entries) => entries.length),
        );
        const basePositions = [
          0, // leftmost
          155 * (maxLength + 1), // middle-left
          310 * (maxLength + 1), // middle
          310 * (maxLength + 1), // middle
          155 * (maxLength + 1), // middle-right
          0, // rightmost
        ];
        x = basePositions[index % 6];
      } else {
        var maxLength = Math.max(
          ...Object.values(timeGroupedEntries).map((entries) => entries.length),
        );
        maxLength < 3 ? (maxLength = 3) : maxLength;
        if (index === 0) {
          x = 0 - lengthhere * 140;
        } else {
          const basePositions = [
            0, // leftmost
            155 * maxLength, // middle-left
            310 * maxLength, // middle
            310 * maxLength, // middle
            155 * maxLength, // middle-right
            0, // rightmost
          ];

          x = basePositions[index % 6] - lengthhere * 140;
        }
      }

      const y = 250 * Math.floor(index / 3);
      const nodeData = {
        id: nodeId,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div className="flex flex-col min-w-[200px]">
              <div className="text-sm font-medium text-gray-800 p-2">
                {time}
              </div>
              <div className="border-t-2 border-[#d68787]" />
              <div className="flex flex-wrap justify-center p-2 gap-2">
                <div className="text-sm text-gray-800 break-all">
                  {timeEntries.map((entry) => entry.value).join(" , ")}
                </div>
              </div>
            </div>
          ),
        },
        style: {
          border: "2px solid #d68787",
          borderRadius: "10px",
          backgroundColor: "#fefece",
          padding: 0,
          width: "auto",
          minWidth: "200px",
          height: "auto",
          fontSize: "12px",
          overflow: "visible",
        },
        draggable: false,
      };

      parsedNodes.push(nodeData);

      // Create edges between nodes
      if (parsedNodes.length > 1) {
        const prevNode = parsedNodes[parsedNodes.length - 2];
        const edgeType = prevNode.position.y === y ? "step" : "straight";

        parsedEdges.push({
          id: `edge-${prevNode.id}-${nodeId}`,
          source: prevNode.id,
          target: nodeId,
          type: edgeType,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#d68787",
          },
          style: {
            stroke: "#d68787",
            strokeWidth: 2,
          },
        });
      }
    });

    // Add edge from start node to first time node
    if (parsedNodes.length > 1) {
      parsedEdges.unshift({
        id: "edge-start",
        source: "start",
        target: parsedNodes[1].id,
        type: "straight",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#000000",
        },
        style: {
          stroke: "#000000",
          strokeWidth: 2,
        },
      });
    }

    setNodes(parsedNodes);
    setEdges(parsedEdges);
  }, []);

  // Process file content when it changes
  useEffect(() => {
    if (fileContent) {
      const parsedEntries = parseFileContent(fileContent);
      setTraceEntries(parsedEntries);
      createNodesAndEdges(parsedEntries);
    }
  }, [fileContent, parseFileContent, createNodesAndEdges]);

  // Handle inserting symbols into the property textarea
  const handlePropertyInsert = useCallback(
    (symbol) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert the symbol at cursor position
      const updatedValue =
        property.slice(0, start) + symbol + property.slice(end);
      setProperty(updatedValue);

      // Ensure cursor is placed after the inserted symbol
      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPosition = start + symbol.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },
    [property],
  );

  // Check if the specified property holds for the trace
  const checkProperty = useCallback(
    (propertyStr) => {
      // Helper function to get all time points in chronological order
      const getAllTimes = () => {
        return [...new Set(traceEntries.map((d) => d.time))].sort(
          (a, b) => Number(a) - Number(b),
        );
      };

      // Generic function to get a value at a specific time point
      const getValueAtTime = (objVarStr, time) => {
        const [obj, variable] = objVarStr.split(".");
        const entry = traceEntries.find(
          (e) => e.time === time && e.obj === obj && e.variable === variable,
        );
        return entry ? entry.value : null;
      };

      // Main evaluation function with support for nested G operators
      const evaluate = (expr, time) => {
        expr = expr.trim();

        // Handle nested expressions in brackets or parentheses
        if (
          (expr.startsWith("[") && expr.endsWith("]")) ||
          (expr.startsWith("(") && expr.endsWith(")"))
        ) {
          return evaluate(expr.slice(1, -1), time);
        }

        // Handle logical operators
        if (expr.startsWith("¬")) {
          return !evaluate(expr.slice(1).trim(), time); // Negation: Invert the result
        }

        // Handle implications (A → B)
        if (expr.includes("→")) {
          const [antecedent, consequent] = expr.split("→").map((s) => s.trim());

          // Evaluate antecedent (before the →)
          const antecedentResult = evaluate(antecedent, time);

          // Evaluate consequent (after the →)
          const consequentResult = evaluate(consequent, time);

          // Implication is true if:
          // - antecedent is false (then it's always true),
          // - or consequent is true (then it's also true).
          // - Implication is false only if antecedent is true and consequent is false
          return !antecedentResult || consequentResult;
        }

        // Handle temporal operators (e.g., G, F, etc.)
        if (expr.startsWith("G")) {
          const subExpr = expr.slice(1).trim();
          const allTimes = getAllTimes();
          return allTimes.every((t) => evaluate(subExpr, t));
        }

        // Handle equality expressions (e.g., Fw1.In = PKT)
        if (expr.includes("=")) {
          const [leftSide, rightSide] = expr.split("=").map((s) => s.trim());

          if (leftSide.includes(".")) {
            const actualValue = getValueAtTime(leftSide, time);
            if (actualValue === null) return false;
            return actualValue.toString().trim() === rightSide.trim();
          }
        }

        return false;
      };

      // Property evaluation with detailed error reporting
      try {
        const times = getAllTimes();
        const result = evaluate(propertyStr, times[0]);

        if (!result) {
          // Find the failing time point for better error reporting
          for (const time of times) {
            if (!evaluate(propertyStr, time)) {
              const failingValues = propertyStr
                .match(/[\w.]+\s*=\s*\w+/g)
                ?.map((expr) => {
                  const [objVar] = expr.split("=").map((s) => s.trim());
                  const value = getValueAtTime(objVar, time);
                  return `${objVar} = ${value}`;
                })
                .join(", ");

              setPropertyResult(
                `Property fails at time ${time} (${failingValues})`,
              );
              return false;
            }
          }
        }

        setPropertyResult("Property holds for all times");
        return result;
      } catch (error) {
        console.error("Error evaluating property:", error);
        setPropertyResult(`Error evaluating property: ${error.message}`);
        return false;
      }
    },
    [traceEntries],
  );

  // Handler for the check property button
  const handleCheckProperty = useCallback(() => {
    const result = checkProperty(property);
    setIsPropertyValid(result);
  }, [property, checkProperty]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#473a17] p-4 justify-start items-start bg-[#fefece] w-3/4">
        TCOB Trace Visualization
      </h2>
      {fileContent ? (
        <div className="flex h-[90vh]">
          {/* Visualization area */}
          <div className="w-3/4">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              key={nodes.length}
              attributionPosition="bottom-left"
              fitView
              minZoom={0.1} // Allow zooming out more
              maxZoom={2} // Allow zooming in more
              panOnScroll={true} // Enable scrolling to pan
              zoomOnScroll={true} // Enable scroll wheel zooming
              zoomOnPinch={true} // Enable pinch zooming
              preventScrolling={false}
              nodesDraggable={true} // Allow nodes to be dragged
              connectionMode="loose"
              defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            >
              <Controls /> {/* Existing controls */}
              <Background color="#f0f0f0" variant="dots" gap={20} size={1} />
            </ReactFlow>
          </div>
          {/* Property input area */}
          <div className="flex flex-col items-center content-center h-auto w-1/4 bg-slate-300 rounded-md fixed right-1">
            <h1 className="text-lg mt-4">Enter the property</h1>
            <div className="flex flex-wrap gap-4 ml-2 mt-5 justify-center">
              <textarea
                ref={textareaRef}
                name="property"
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className=" rounded-lg p-2 w-[90%] h-[20%]"
              />
              {/* Logical operator buttons */}
              {[
                "¬",
                "G",
                "∧",
                "→",
                "F",
                "=",
                "(",
                ")",
                "<",
                ">",
                "<=",
                ">=",
              ].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handlePropertyInsert(symbol)}
                  className="bg-slate-500 rounded-md p-4 text-white"
                >
                  {symbol}
                </button>
              ))}
              {/* Variable buttons */}
              {uniqueObjectsAndValue.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handlePropertyInsert(symbol)}
                  className="bg-slate-500 rounded-md p-3 text-white"
                >
                  {symbol}
                </button>
              ))}
            </div>

            <button
              onClick={handleCheckProperty}
              className="mt-5 bg-blue-500 text-white p-2 rounded-md"
            >
              Check Property
            </button>
            <div className="mt-4">
              {propertyResult && (
                <p
                  className={
                    isPropertyValid ? "text-green-500" : "text-red-500"
                  }
                >
                  {propertyResult}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading file content...</div>
      )}
    </div>
  );
}

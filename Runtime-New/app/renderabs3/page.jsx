"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFileContentStore, useSelectedVArrayStore } from "@/data/data";
import {
  combineTraceEntries,
  removeConsecutiveDuplicates,
} from "@/functions/entrychanges";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";
import GenerateGraphvizCode from "@/functions/generategraphvizcode";
import { instance } from "@viz-js/viz";

const GraphvizDiagram = () => {
  const { fileContent } = useFileContentStore();
  const { getSelectedVArray } = useSelectedVArrayStore();
  const [diagramCode, setDiagramCode] = useState("");
  const [property, setProperty] = useState("");
  const [uniqueObjectsAndValue, setUniqueObjectsAndValue] = useState([]);
  const [traceEntries, setTraceEntries] = useState([]);
  const [propertyResult, setPropertyResult] = useState("");
  const [isPropertyValid, setIsPropertyValid] = useState(false);
  const textareaRef = useRef(null);

  // Function to map values to standardized states
  const mapToStandardState = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0.0";
    if (numValue < 0.5) return "0.0";
    if (numValue >= 0.5 && numValue <= 0.8) return "0.5";
    return "1.0";
  };

  const removetimeDuplicates = (entries) => {
    const uniqueEntries = [];
    const timeGroups = entries.reduce((acc, entry) => {
      if (!acc[entry.time]) {
        acc[entry.time] = [];
      }
      acc[entry.time].push(entry);
      return acc;
    }, {});
    var val = 0;

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

      const combinedValue =
        uniqueValues.length > 1 && uniqueValues.value !== ""
          ? uniqueValues.join("_")
          : uniqueValues[0];
      val++;

      uniqueEntries.push({
        time: val,
        value: combinedValue,
        obj,
        variable,
      });
    });

    return uniqueEntries;
  };

  const parseFileContent = useCallback((content) => {
    const selectedEntries = getSelectedVArray() || [];
    const lines = content.split("\n");
    const entries = [];

    const tracePattern =
      /Time\s*=\s*(\d+):\s*Obj\s*=\s*([\w\[\]]+):\s*Var\s*=\s*([\w\d]+):\s*Val\s*=\s*([^\s]+)/;

    lines.forEach((line) => {
      const match = line.match(tracePattern);
      if (match) {
        let [_, time, obj, variable, value] = match;
        time = Number(time);
        if (isNaN(time) || value === "NaV") {
          value = "";
          return;
        }
        // Map the value to standardized state before adding to entries
        var standardValue = [];
        if (obj === "P") {
          standardValue = mapToStandardState(formatDecimalValue(value));
        } else {
          standardValue = formatDecimalValue(value);
        }
        const objVarKey = `${obj}.${variable}`;

        if (
          selectedEntries.includes(objVarKey) ||
          selectedEntries.length === 0
        ) {
          entries.push({
            time,
            obj,
            variable,
            value: standardValue,
          });
        }
      }
    });

    const combinedEntries = combineTraceEntries(entries);

    const finalEntries = removeConsecutiveDuplicates(combinedEntries);
    console.log("Entries:", finalEntries);

    const timefinalentries = removetimeDuplicates(finalEntries);
    setTraceEntries(timefinalentries);

    const uniqueCombinations = entries
      .map((entry) => entry.obj + "." + entry.variable)
      .filter((variable, index, self) => self.indexOf(variable) === index);
    setUniqueObjectsAndValue(uniqueCombinations);

    const graphvizCode = GenerateGraphvizCode(finalEntries);
    setDiagramCode(graphvizCode);
  }, []);

  const handlePropertyInsert = useCallback(
    (symbol) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updatedValue =
        property.slice(0, start) + symbol + property.slice(end);
      setProperty(updatedValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPosition = start + symbol.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },
    [property],
  );

  const checkProperty = useCallback(
    (propertyStr) => {
      const getAllTimes = () => {
        return [...new Set(traceEntries.map((d) => d.time))].sort(
          (a, b) => Number(a) - Number(b),
        );
      };

      const getValueAtTime = (objVarStr, time) => {
        const [obj, variable] = objVarStr.split(".");
        const entry = traceEntries.find(
          (e) => e.time === time && e.obj === obj && e.variable === variable,
        );
        console.log("Entry:", entry);
        return entry ? entry.value : null;
      };

      const evaluate = (expr, currentTime) => {
        // Remove all surrounding brackets/parentheses at once
        while (
          (expr.startsWith("[") && expr.endsWith("]")) ||
          (expr.startsWith("(") && expr.endsWith(")"))
        ) {
          expr = expr.slice(1, -1).trim();
        }

        if (expr.startsWith("¬")) {
          return !evaluate(expr.slice(1).trim(), currentTime);
        }

        if (expr.includes("→")) {
          const [antecedent, consequent] = expr.split("→").map((s) => s.trim());
          return (
            !evaluate(antecedent, currentTime) ||
            evaluate(consequent, currentTime)
          );
        }

        if (expr.startsWith("F")) {
          const subExpr = expr.slice(1).trim();
          const allTimes = getAllTimes().filter((t) => t >= currentTime); // Only consider future times
          return allTimes.some((t) => evaluate(subExpr, t));
        }

        if (expr.startsWith("G")) {
          const subExpr = expr.slice(1).trim();
          const allTimes = getAllTimes().filter((t) => t >= currentTime); // Only consider future times
          return allTimes.every((t) => evaluate(subExpr, t));
        }

        if (expr.includes("=")) {
          const [leftSide, rightSide] = expr.split("=").map((s) => s.trim());
          if (leftSide.includes(".")) {
            const actualValue = getValueAtTime(leftSide, currentTime);
            return (
              actualValue !== null &&
              actualValue.toString().trim() === rightSide.trim()
            );
          }
        }

        return false;
      };

      try {
        const times = getAllTimes();
        const result = evaluate(propertyStr, times[0]);

        if (!result) {
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

  const handleCheckProperty = useCallback(() => {
    const result = checkProperty(property);
    setIsPropertyValid(result);
  }, [property, checkProperty]);

  useEffect(() => {
    if (fileContent) parseFileContent(fileContent);
  }, [fileContent, parseFileContent]);

  useEffect(() => {
    if (diagramCode) {
      const graphvizContainer = document.getElementById("graphviz-container");
      if (graphvizContainer) {
        instance()
          .then((viz) => {
            const svgElement = viz.renderSVGElement(diagramCode);
            graphvizContainer.innerHTML = "";
            graphvizContainer.appendChild(svgElement);
          })
          .catch((error) => {
            console.error("Error initializing Viz instance:", error);
          });
      }
    }
  }, [diagramCode]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between p-4">
        <div className="w-3/4">
          <div id="graphviz-container" className="graphviz-container"></div>
        </div>
        <div className="flex flex-col items-center content-center h-auto w-auto max-w-[29%] bg-slate-300 rounded-md fixed right-1">
          <h1 className="text-lg mt-4">Enter the property</h1>
          <div className="flex flex-wrap gap-4 ml-2 mt-5 justify-center">
            <textarea
              ref={textareaRef}
              name="property"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="mt-5 rounded-lg p-2 w-[90%] h-[40%]"
            />
            {["¬", "G", "∧", "→", "F", "=", "(", ")", "<", ">", "<=", ">="].map(
              (symbol) => (
                <button
                  key={symbol}
                  onClick={() => handlePropertyInsert(symbol)}
                  className="bg-slate-500 rounded-md p-4 text-white"
                >
                  {symbol}
                </button>
              ),
            )}
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
            className="mt-20 bg-blue-500 text-white p-2 rounded-md"
          >
            Check Property
          </button>
          <div className="mt-4">
            {propertyResult && (
              <p
                className={isPropertyValid ? "text-green-500" : "text-red-500"}
              >
                {propertyResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphvizDiagram;

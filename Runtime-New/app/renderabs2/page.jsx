"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import mermaid from "mermaid";
import { useFileContentStore } from "@/data/data";
import {
  combineTraceEntries,
  removeConsecutiveDuplicates,
} from "@/functions/entrychanges";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";
import GenerateMermaidCode from "@/functions/generatemermaidcodeabs";

const MermaidDiagram = () => {
  const { fileContent } = useFileContentStore();
  const [diagramCode, setDiagramCode] = useState("");
  const [property, setProperty] = useState("");
  const [uniqueObjectsAndValue, setUniqueObjectsAndValue] = useState([]);
  const [traceEntries, setTraceEntries] = useState([]);
  const [propertyResult, setPropertyResult] = useState("");
  const [isPropertyValid, setIsPropertyValid] = useState(false);
  const textareaRef = useRef(null);

  const parseFileContent = useCallback((content) => {
    const lines = content.split("\n");
    const entries = [];

    const tracePattern =
      /Time\s*=\s*(\d+):\s*Obj\s*=\s*(\w+):\s*Var\s*=\s*(\w+):\s*Val\s*=\s*([^\s]+)/;

    lines.forEach((line) => {
      const match = line.match(tracePattern);
      if (match) {
        let [_, time, obj, variable, value] = match;
        time = Number(time);
        if (isNaN(time) || value === "NaV") {
          value = "";
          return;
        }
        entries.push({
          time,
          obj,
          variable,
          value: formatDecimalValue(value),
        });
      }
    });

    const combinedEntries = combineTraceEntries(entries);
    const finalEntries = removeConsecutiveDuplicates(combinedEntries)

    setTraceEntries(finalEntries);

    const uniqueCombinations = entries
      .map((entry) => entry.obj + "." + entry.variable)
      .filter((variable, index, self) => self.indexOf(variable) === index);
    setUniqueObjectsAndValue(uniqueCombinations);

    const mermaidCode = GenerateMermaidCode(finalEntries);
    setDiagramCode(mermaidCode);
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
    [property]
  );

  const checkProperty = useCallback(
    (propertyStr) => {
      const getAllTimes = () => {
        const times = traceEntries
          .map((d) => Number(d.time))
          .filter((t) => !isNaN(t));
        return [...new Set(times)].sort((a, b) => a - b);
      };

      const getValueAtTime = (objVarStr, time) => {
        if (isNaN(time)) return null;
        const [obj, variable] = objVarStr.split(".");
        const entry = traceEntries.find(
          (e) => e.time === time && e.obj === obj && e.variable === variable
        );
        return entry ? entry.value : null;
      };

      const evaluate = (expr, time) => {
        expr = expr.trim();

        if (
          (expr.startsWith("[") && expr.endsWith("]")) ||
          (expr.startsWith("(") && expr.endsWith(")"))
        ) {
          return evaluate(expr.slice(1, -1), time);
        }

        if (expr.startsWith("¬")) {
          return !evaluate(expr.slice(1).trim(), time);
        }

        if (expr.includes("∧")) {
          const subExpressions = expr.split("∧").map((s) => s.trim());
          return subExpressions.every((subExpr) => evaluate(subExpr, time));
        }

        if (expr.includes("→")) {
          const [antecedent, consequent] = expr.split("→").map((s) => s.trim());
          return !evaluate(antecedent, time) || evaluate(consequent, time);
        }

        if (expr.startsWith("G")) {
          const subExpr = expr.slice(1).trim();
          return checkGlobal(subExpr, time);
        }

        if (expr.startsWith("F")) {
          const subExpr = expr.slice(1).trim();
          return checkFuture(subExpr, time);
        }

        if (expr.includes("=")) {
          return evaluateEquality(expr, time);
        }

        return false;
      };

      const checkGlobal = (subExpr, startTime) => {
        const times = getAllTimes().filter((time) => time >= startTime);
        return times.every((time) => evaluate(subExpr, time));
      };

      const checkFuture = (subExpr, startTime) => {
        const times = getAllTimes().filter((time) => time >= startTime);
        return times.some((time) => checkGlobal(subExpr, time));
      };

      const evaluateEquality = (expr, time) => {
        const [leftSide, rightSide] = expr.split("=").map((s) => s.trim());
        if (leftSide.includes(".")) {
          const actualValue = getValueAtTime(leftSide, time);
          return (
            actualValue !== null &&
            actualValue.toString().trim() === rightSide.trim()
          );
        }
        return false;
      };

      try {
        const times = getAllTimes();
        const result = evaluate(propertyStr, times[0]);

        if (!result) {
          for (const time of times) {
            if (!evaluate(propertyStr, time)) {
              setPropertyResult(`Property fails at time ${time}`);
              return false;
            }
          }
        }

        setPropertyResult("Property holds for all times");
        return !result;
      } catch (error) {
        setPropertyResult(`Error evaluating property: ${error.message}`);
        return false;
      }
    },
    [traceEntries]
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
      mermaid.initialize({ startOnLoad: true });
      mermaid.run();
    }
  }, [diagramCode]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between p-4">
        <div className="w-3/4">
          <div className="mermaid">{diagramCode}</div>
          <div>{diagramCode}</div>
        </div>
        <div className="w-1/4 bg-slate-300 p-4 rounded-md min-h-[80vh]">
          <h1 className="text-lg mb-4">Enter the property</h1>
          <textarea
            ref={textareaRef}
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full p-2 rounded-lg mb-4 h-[20%]"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {"¬ G F ∧ → = < > <= >=".split(" ").map((symbol) => (
              <button
                key={symbol}
                onClick={() => handlePropertyInsert(symbol)}
                className="bg-slate-500 text-white p-2 rounded-md"
              >
                {symbol}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {uniqueObjectsAndValue.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handlePropertyInsert(symbol)}
                className="bg-slate-500 text-white p-2 rounded-md"
              >
                {symbol}
              </button>
            ))}
          </div>
          <button
            onClick={handleCheckProperty}
            className="w-full bg-blue-500 text-white p-2 rounded-md mb-4"
          >
            Check Property
          </button>
          {propertyResult && (
            <p
              className={`text-center ${
                isPropertyValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {propertyResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MermaidDiagram;

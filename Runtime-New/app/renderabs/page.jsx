"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { useFileContentStore } from "@/data/data";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";
import {
  combineTraceEntries,
  removeConsecutiveDuplicates,
} from "@/functions/entrychanges";
import selfloop from "@/assests/images/self_loop_arrow.png";
import Image from "next/image";
import { BaseEdge, getBezierPath } from "reactflow";
import { useMemo } from "react";

const SelfLoopEdge = ({ id, sourceX, sourceY, targetX, targetY, source }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Render the self-loop image only when source and target are the same
  const isSelfLoop = sourceX === targetX && sourceY === targetY;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "#000", strokeWidth: 2 }}
      />
      {isSelfLoop && (
        <foreignObject
          x={sourceX - 20} // Position at the node center
          y={sourceY - 50} // Slightly above the node
          width={40}
          height={40}
        >
          <Image src={selfloop} alt="self-loop" width={40} height={40} />
        </foreignObject>
      )}
    </>
  );
};

const createSelfLoopEdge = (nodeId) => ({
  id: `self-${nodeId}`,
  source: nodeId,
  target: nodeId,
  type: "selfLoop", // Use the custom edge type
});

export default function TCOBTraceVisualization() {
  const { fileContent } = useFileContentStore();
  const [state, setState] = useState({
    nodes: [],
    edges: [],
    property: "",
    uniqueObjectsAndValue: [],
    traceEntries: [],
    propertyResult: "",
    isPropertyValid: false,
    length: 0,
  });

  const textareaRef = useRef(null);

  const updateState = (updates) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const parseFileContent = useCallback((content) => {
    const lines = content.split("\n");
    const entries = [];
    const tracePattern =
      /Time\s*=\s*(\d+):\s*Obj\s*=\s*(\w+):\s*Var\s*=\s*(\w+):\s*Val\s*=\s*([^\s]+)/;

    lines.forEach((line) => {
      const match = line.match(tracePattern);
      if (match) {
        const [_, time, obj, variable, value] = match;
        if (value === "NaV") return;
        entries.push({
          time,
          obj,
          variable,
          value: formatDecimalValue(value),
        });
      }
    });

    updateState({ traceEntries: entries });

    const uniqueCombinations = entries
      .map((entry) => `${entry.obj}.${entry.variable}`)
      .filter((variable, index, self) => self.indexOf(variable) === index);
    updateState({ uniqueObjectsAndValue: uniqueCombinations });

    const combinedEntries = combineTraceEntries(entries);
    const finalEntries = removeConsecutiveDuplicates(combinedEntries);
    createNodesAndEdges(finalEntries);
  }, []);
  const edgeTypes = useMemo(() => ({ selfLoop: SelfLoopEdge }), []);

  const createNodesAndEdges = useCallback((entries) => {
    const parsedNodes = [];
    const parsedEdges = [];
    const uniqueStates = new Map();
    let stateCounter = 0;

    // Add start node
    const startNode = {
      id: "start",
      type: "default",
      position: { x: 0, y: 0 },
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

    // Create unique states and track transitions
    const transitions = new Map();
    let previousValue = null;

    entries.forEach((entry) => {
      const currentValue = entry.value;

      if (!uniqueStates.has(currentValue)) {
        uniqueStates.set(currentValue, {
          id: `state-${stateCounter}`,
          value: currentValue,
          index: stateCounter++,
        });
      }

      if (previousValue !== null) {
        const transitionKey = `${previousValue}->${currentValue}`;
        transitions.set(
          transitionKey,
          (transitions.get(transitionKey) || 0) + 1
        );
      }

      previousValue = currentValue;
    });

    const xSpacing = 300;
    const ySpacing = 100;
    uniqueStates.forEach((stateInfo, stateValue, index) => {
      const nodeData = {
        id: stateInfo.id,
        type: "default",
        position: {
          x: (stateInfo.index + 1) * xSpacing,
          y: (stateInfo.index + 1) * ySpacing,
        },
        data: {
          label: stateValue,
        },
        style: {
          border: "2px solid #d68787",
          borderRadius: "10px",
          backgroundColor: "#fefece",
          padding: 10,
          width: "auto",
          minWidth: "200px",
          height: "auto",
          fontSize: "12px",
          overflow: "visible",
        },
        draggable: false,
      };
      parsedNodes.push(nodeData);
    });

    // Create edges including self-loops
    const processedEdges = new Set();
    entries.forEach((entry, index) => {
      const currentState = uniqueStates.get(entry.value);

      if (index > 0) {
        const prevEntry = entries[index - 1];
        const prevState = uniqueStates.get(prevEntry.value);

        // Self-loop
        if (prevEntry.value === entry.value) {
          const selfLoopId = `self-${currentState.id}`;
          if (!processedEdges.has(selfLoopId)) {
            const selfLoopEdge = createSelfLoopEdge(currentState.id, {
              x: (currentState.index + 1) * xSpacing,
              y: (currentState.index + 1) * ySpacing,
            });
            parsedEdges.push(selfLoopEdge);
            processedEdges.add(selfLoopId);
          }
        } else {
          // Regular transitions
          const edgeId = `${prevState.id}->${currentState.id}`;

          if (!processedEdges.has(edgeId)) {
            parsedEdges.push({
              id: edgeId,
              source: prevState.id,
              target: currentState.id,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed, color: "#d68787" },
              style: { stroke: "#000000", strokeWidth: 2 },
              animated: false,
            });
            processedEdges.add(edgeId);
          }
        }
      }
    });

    // Add initial transition from start node
    if (parsedNodes.length > 1) {
      parsedEdges.unshift({
        id: "edge-start",
        source: "start",
        target: parsedNodes[1].id,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
        style: { stroke: "#000000", strokeWidth: 2 },
      });
    }

    updateState({ nodes: parsedNodes, edges: parsedEdges });
  }, []);

  const handlePropertyInsert = useCallback(
    (symbol) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updatedValue =
        state.property.slice(0, start) + symbol + state.property.slice(end);
      updateState({ property: updatedValue });

      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPosition = start + symbol.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    },
    [state.property]
  );

  useEffect(() => {
    if (fileContent) {
      parseFileContent(fileContent);
    }
  }, [fileContent, parseFileContent]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#473a17] p-4 justify-start items-start bg-[#fefece] w-3/4">
        TCOB Trace Visualization
      </h2>
      {fileContent ? (
        <div className="flex h-[90vh]">
          <div className="w-3/4">
            <ReactFlow
              nodes={state.nodes}
              edges={state.edges}
              edgeTypes={edgeTypes}
              attributionPosition="bottom-left"
              fitView
            >
              <Controls />
              <Background color="#f0f0f0" variant="dots" />
            </ReactFlow>
          </div>
          <div className="flex flex-col items-center content-center w-1/4 bg-slate-300 h-[80vh] rounded-md">
            <h1 className="text-lg mt-4">Enter the property</h1>
            <div className="flex flex-wrap gap-4 ml-2 mt-5 justify-center">
              <textarea
                ref={textareaRef}
                name="property"
                value={state.property}
                onChange={(e) => updateState({ property: e.target.value })}
                className="mt-5 rounded-lg p-2 w-[90%] h-[20%]"
              />
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
              {state.uniqueObjectsAndValue.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handlePropertyInsert(symbol)}
                  className="bg-slate-500 rounded-md p-3 text-white"
                >
                  {symbol}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {state.propertyResult && (
                <p
                  className={
                    state.isPropertyValid ? "text-green-500" : "text-red-500"
                  }
                >
                  {state.propertyResult}
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

import React from "react";

export default function generateMermaidCode(states) {
  // Handle empty state array
  if (states.length === 0) return "stateDiagram-v2\n";

  // Updated mapping function with new ranges
  const mapToStandardState = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0.0";
    if (numValue < 0.5) return "0.0";
    if (numValue >= 0.5 && numValue <= 0.8) return "0.5";
    return "1.0";
  };

  // Check if any state has yellow marking
  const hasYellowState = states.some((state) => state.value.includes("yellow"));

  if (hasYellowState) {
    // Original yellow state handling logic
    for (let i = 0; i < states.length; i++) {
      if (
        !states[i].value.includes("&comma;") &&
        states[i].value.includes("yellow")
      ) {
        states[i].value = `${states[i].value}&comma;${states[i].value}`;
      }
    }

    // Generate diagram with original yellow state logic
    let mermaidCode = "stateDiagram-v2\n";
    mermaidCode += ` [*] --> ${states[0].value}:::cl1`;

    for (let i = 0; i < states.length - 1; i++) {
      mermaidCode += ` ${states[i].value}:::cl1 --> ${
        states[i + 1].value
      }:::cl1 `;
    }

    mermaidCode +=
      "classDef cl1 fill:#fefece,stroke:#e5b6b8,stroke-width:1.5px,rx:15px,ry:15px; linkStyle default stroke:blue,stroke-width:2px;";
    return mermaidCode;
    
  } else {
    // Generate dynamic state diagram based on actual values
    let mermaidCode = "stateDiagram-v2\n";

    // Map all states
    const mappedStates = states.map((state) => mapToStandardState(state.value));

    // Get unique states for creating all possible states in diagram
    const uniqueStates = [...new Set(mappedStates)].sort();

    // Add initial transition to the first state
    mermaidCode += `    [*] --> ${mappedStates[0]}:::cl1\n`;

    // Track which transitions we've already added to avoid duplicates
    const addedTransitions = new Set();

    // Function to add transition if it hasn't been added yet
    const addTransition = (from, to) => {
      const transitionKey = `${from}:::cl1->${to}:::cl1`;
      if (!addedTransitions.has(transitionKey)) {
        mermaidCode += `    ${from}:::cl1 --> ${to}:::cl1\n`;
        addedTransitions.add(transitionKey);
      }
    };

    // Add transitions including self-loops
    for (let i = 0; i < mappedStates.length - 1; i++) {
      const currentState = mappedStates[i];
      const nextState = mappedStates[i + 1];

      // Add self-loop if we find consecutive same states
      if (currentState === nextState) {
        addTransition(currentState, currentState);
      }

      // Add transition to next state if different
      if (currentState !== nextState) {
        addTransition(currentState, nextState);
      }
    }
    mermaidCode +=
      "classDef cl1 fill:#fefece,stroke:#e5b6b8,stroke-width:1.5px,rx:15px,ry:15px; linkStyle default stroke:blue,stroke-width:2px;";

    return mermaidCode;
  }
}

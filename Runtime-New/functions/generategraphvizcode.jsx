export default function generateGraphvizCode(states) {
  // Handle empty state array
  if (states.length === 0) return "digraph G {\n}\n";

  // Check if any state has yellow marking
  const hasYellowState = states.some((state) => state.value.includes("yellow"));

  if (hasYellowState) {
    let graphvizCode = "digraph G {\n";
    graphvizCode += `start [shape=circle, width=0.2, height=0.2, style=filled, fillcolor=black, label=""]; \n`;
    graphvizCode += ` node [shape=box,style="filled,rounded", fillcolor="#fefece", color="#d68787", fontsize=20];\n  edge [color="#d68787"];\n`;
    // Handling states with yellow marking
    for (let i = 0; i < states.length; i++) {
      if (
        states[i].value.includes("yellow") &&
        !states[0].value.includes("_")
      ) {
        states[i].value = states[i].value.replace("yellow", "");
        states[i].value = "yellow";
        continue;
      }
      if (
        !states[i].value.includes("_") &&
        states[i].value.includes("yellow")
      ) {
        states[i].value = `${states[i].value}, ${states[i].value}`;
      }
    }

    // Generate diagram with yellow state logic
    graphvizCode += `  start -> "${states[0].value.replace(/_/g, ", ")}"\n`;

    for (let i = 0; i < states.length - 1; i++) {
      let fromState = `"${states[i].value.replace(/_/g, ", ")}"`;
      let toState = `"${states[i + 1].value.replace(/_/g, ", ")}"`;
      let code = `  ${fromState} -> ${toState}\n`;

      if (!graphvizCode.includes(code)) {
        graphvizCode += code;
      }
    }

    graphvizCode += `}\n`;
    return graphvizCode;
  } else {
    let graphvizCode = "digraph G {\n";
    // Add graph size and layout attributes
    if (states.length > 10) {
      graphvizCode += `  size="200,200";\n`;
      graphvizCode += `  ratio="compress";\n`;
      graphvizCode += `  ranksep=0.5;\n`; // Further reduce space between ranks
      graphvizCode += `  nodesep=0.5;\n`; // Further reduce space between nodes

      graphvizCode += `  start [shape=circle, width=0.2, height=0.2, style=filled, fillcolor=black, label=""]; \n`;
      graphvizCode += `  node [shape=box,style="filled,rounded", fillcolor="#fefece", color="#d68787", fontsize=20];\n`;
      graphvizCode += `  edge [color="#d68787"];\n`;
    } else {
      graphvizCode += `  start [shape=circle, width=0.2, height=0.2, style=filled, fillcolor=black, label=""]; \n`;
      graphvizCode += `  node [shape=box,style="filled,rounded", fillcolor="#fefece", color="#d68787", fontsize=20];\n`;
      graphvizCode += `  edge [color="#d68787"];\n`;
    }

    // Ensure states are mapped properly
    graphvizCode += `  start -> "${states[0].value}";\n`;

    const addedTransitions = new Set();

    const addTransition = (from, to) => {
      const transitionKey = `${from.value}->${to.value}`;

      if (!addedTransitions.has(transitionKey)) {
        graphvizCode += `  "${from.value}" -> "${to.value}";\n`;
        addedTransitions.add(transitionKey);
      }
    };

    for (let i = 0; i < states.length - 1; i++) {
      const currentState = states[i];
      const nextState = states[i + 1];

      if (currentState === nextState) {
        addTransition(currentState, currentState);
      } else {
        addTransition(currentState, nextState);
      }
    }

    // Adding styles for nodes and edges
    graphvizCode += "}\n";

    return graphvizCode;
  }
}

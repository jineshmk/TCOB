import React from "react";

export default function generateMermaidCode(states) {
  let mermaidCode = `block-beta\ncolumns 5\nStart((" ")) space space space space \n space space space space space \n`;

  for (let i = 0; i < (states.length - 1) / 3; i++) {
    mermaidCode += `${3 * i} space ${3 * i + 1} space ${3 * i + 2} \n`;
    mermaidCode += `space space space space space \n`;
  }

  for (let i = 0; i < states.length - 1; i++) {
    if (i == 0) {
      mermaidCode += `Start --> ${i}\n`;
    } else {
      if (i % 3 == 0) {
        mermaidCode += `${i - 1} --> ${i}\n`;
      } else {
        mermaidCode += `${i - 1} --> ${i}\n`;
      }
    }
  }

  for (let i = 0; i < states.length; i++) {
    mermaidCode += `${i}["${states[i].time}\n${states[i].value}"]\n`;
  }

  let code = `block-beta a b c
`;

  return code;
}

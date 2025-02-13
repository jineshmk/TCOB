"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";
import { useFileContentStore } from "@/data/data";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";
import generateMermaidCode from "@/functions/generatemermaiduml";

const parseFileContent = (content) => {
  const lines = content.split("\n");
  const traceEntries = [];

  const tracePattern =
    /Time\s*=\s*(\d+):\s*Obj\s*=\s*(\w+):\s*Var\s*=\s*(\w+):\s*Val\s*=\s*([^\s]+)/;

  lines.forEach((line) => {
    const match = line.match(tracePattern);
    if (match) {
      const [_, time, obj, variable, value] = match;
      traceEntries.push({
        time,
        value: formatDecimalValue(value),
      });
    }
  });

  const timeGroupedEntries = traceEntries.reduce((acc, entry) => {
    const existingEntry = acc[entry.time]?.find((e) => e.time === entry.time);

    if (existingEntry) {
      existingEntry.value = `${existingEntry.value},${entry.value}`;
    } else {
      acc[entry.time] = [...(acc[entry.time] || []), { ...entry }];
    }

    return acc;
  }, {});

  const timeValueEntries = Object.entries(timeGroupedEntries).flatMap(([time, values]) =>
    values.map((entry) => ({ time, value: entry.value }))
  );

  return timeValueEntries;
};

const MermaidDiagram = () => {
  const { fileContent } = useFileContentStore();
  const [diagramCode, setDiagramCode] = useState("");

  useEffect(() => {
    if (fileContent) {
      const parsedEntries = parseFileContent(fileContent);
      const mermaidCode = generateMermaidCode(parsedEntries);
      setDiagramCode(mermaidCode);
    }
  }, [fileContent]);

  useEffect(() => {
    if (diagramCode) {
      mermaid.initialize({ startOnLoad: true,
        theme:'default',
        experimental: {
          enabled: true
        }
       });
      mermaid.run();
    }
  }, [diagramCode]);

  return (
    <div className="flex flex-col items-center justify-center mt-[20vh]">
      <div className="mermaid">{diagramCode}</div>
      {diagramCode}
    </div>
  );
};

export default MermaidDiagram;

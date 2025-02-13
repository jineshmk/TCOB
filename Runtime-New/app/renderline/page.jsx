"use client";

import * as React from "react";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useFileContentStore } from "@/data/data";
import { SpecialcombineTraceEntries } from "@/functions/entrychanges";
import { formatDecimalValue } from "@/functions/formatdecimalvalues";

Chart.register(CategoryScale);

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
        obj,
        variable,
        value: formatDecimalValue(value),
      });
    }
  });

  return SpecialcombineTraceEntries(traceEntries);
};

export default function CategoricalYLineChart() {
  const { fileContent } = useFileContentStore();
  const traceEntries = parseFileContent(fileContent);

  const groupedData = {};
  const categories = [];

  traceEntries.forEach((entry) => {
    if (!groupedData[entry.value]) {
      groupedData[entry.value] = [];
      categories.push(entry.value);
    }
    groupedData[entry.value].push({
      x: entry.time,
      y: entry.value,
    });
    console.log(entry);
  });

  const datasets = Object.entries(groupedData).map(([category, values]) => ({
    label: category,
    data: values.sort((a, b) => a.x - b.x),
    borderColor: "#4474a2",
    backgroundColor: "#4474a2",
    tension: 0.2,
    fill: false,
  }));

  const options = {
    scales: {
      y: {
        type: "linear",
        labels: categories.reverse(),
      },
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Time",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chartData = {
    datasets: datasets,
  };

  return (
    <div className="w-[50vw] h-[60vh]">
      <Line data={chartData} options={options} />
    </div>
  );
}

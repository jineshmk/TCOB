"use client";
import React, { useState, useCallback } from "react";
import { useFileContentStore } from "@/data/data";
import { useRouter } from "next/navigation";

function FileUploader() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const { fileContent, setFileContent } = useFileContentStore();
  const router = useRouter();

  const handleFileChange = useCallback((event) => {
    setFile(null);
    setError("");
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);
    } else {
      setError("Please select a .txt file");
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!file) {
        setError("Please select a file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);

        router.push("/add");
      };

      reader.onerror = () => {
        setError("Error reading file");
      };

      reader.readAsText(file);
    },
    [file, setFileContent, router]
  );

  return (
    <div className="max-w-md max-h-fit mx-auto p-6 bg-white shadow rounded-lg">
      <div className="p-2 text-[#735b27] font-bold bg-[#fcf3cf] rounded-sm">
        TCOB Trace Visualization
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700 my-3 "
          >
            <div>Upload Your Text File</div>
            <div className="text-[10px] pl-2">
              Drag and drop file or click to browse
            </div>
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 px-4 py-2 border border-gray-300 rounded-lg
                   file:mr-4 file:rounded-lg file:border-0
                   file:bg-[#e7eaed] file:text-gray-700 file:py-2 file:px-4
                    focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-between flex-row gap-y-3">
          <button
            className="w-2/4 px-3 text-white bg-[#a855f7] rounded-lg
                    focus:outline-none focus:ring-2 
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Download Sample
          </button>
          <button
            type="submit"
            disabled={!file}
            className="w-1/4 px-3 text-white bg-[#cb4548] rounded-lg
                    focus:outline-none focus:ring-2 
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#cfdefb] min-h-screen flex items-center justify-center">
      <FileUploader />
    </div>
  );
}

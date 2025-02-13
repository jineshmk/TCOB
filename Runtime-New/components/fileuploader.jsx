'use client'
import React, { useState } from 'react';
import { useFileContentStore } from '@/data/data';
import LogParser from '@/functions/addvariables';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { fileContent, setFileContent } = useFileContentStore();

  const handleFileChange = (event) => {
    setFile(null);
    setError('');
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/plain') {
      setFile(selectedFile);
    } else {
      setError('Please select a .txt file');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Text File
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
       
        <button
          type="submit"
          disabled={!file}
          className="w-full bg-blue-600 text-white py-2 rounded
            hover:bg-blue-600 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Read File
        </button>
      </form>
      {fileContent && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <LogParser fileContent={fileContent} />
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { useFileContentStore } from "@/data/data";

export default function checkProperty(str) {
  const { fileContent } = useFileContentStore();
  console.log(FileContent);
}

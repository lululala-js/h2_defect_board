"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-gray-600 rounded-full btn-soft"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        데이터 파일 선택
      </Button>
      <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
      {fileName && <p className="text-sm text-gray-300 mt-2">선택된 파일: {fileName}</p>}
    </div>
  )
}


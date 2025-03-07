"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"

export function DragAndDropInput({
  onChange,
  accept = "*",
}: {
  onChange: (file: File | null) => void
  accept?: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      onChange(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    onChange(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ${
        isDragging
          ? "border-primary bg-primary/5"
          : file
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-gray-300 bg-gray-50 hover:border-primary/50 dark:border-gray-700 dark:bg-gray-900"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragOver}
    >
      <Input
        ref={inputRef}
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
      />

      <div className="flex flex-col items-center justify-center gap-2">
        {file ? (
          <>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
              <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Archivo Seleccionado:</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemoveFile} className="mt-2">
              <X className="w-4 h-4 mr-2" />
              Remove file
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Drag and drop your file here</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                or{" "}
                <button type="button" onClick={handleButtonClick} className="text-primary underline">
                  click para buscar
                </button>
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {accept !== "*" ? `Accepted formats: ${accept}` : "All file types accepted"}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
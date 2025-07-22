"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploadZoneProps {
  onUpload: (data: { url: string; key: string }) => void
  currentImage?: string
  multiple?: boolean
  className?: string
}

export default function ImageUploadZone({
  onUpload,
  currentImage,
  multiple = false,
  className = "",
}: ImageUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          alert(`${file.name} is not a valid image or video file`)
          continue
        }

        // Create FormData for upload
        const formData = new FormData()
        formData.append("file", file)

        // Upload to backend (which will handle UploadThing)
        const response = await fetch("http://localhost:8000/api/media/upload_to_uploadthing/", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          onUpload({
            url: result.file_url,
            key: result.file_key,
          })
        } else {
          const error = await response.json()
          alert(`Failed to upload ${file.name}: ${error.error || "Unknown error"}`)
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onUpload({ url: "", key: "" })
  }

  return (
    <div className={`relative ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <div className="relative w-full h-full overflow-hidden rounded-lg border-2 border-gray-200">
            <Image src={currentImage || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          </div>
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
              <p className="text-amber-600">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {multiple ? "Drag and drop images/videos here" : "Drag and drop an image here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button variant="outline" type="button">
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose {multiple ? "Files" : "File"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*,video/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
}

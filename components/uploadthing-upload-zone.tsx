"use client"

import { useState, useCallback } from "react"
import { Upload, X, ImageIcon, Video, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDropzone } from "react-dropzone"
import Image from "next/image"

interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

interface UploadThingUploadZoneProps {
  onUpload: (files: UploadedFile[]) => void
  currentFiles?: UploadedFile[]
  multiple?: boolean
  className?: string
  endpoint?: "imageUploader" | "videoUploader" | "mediaUploader"
}

export default function UploadThingUploadZone({
  onUpload,
  currentFiles = [],
  multiple = false,
  className = "",
  endpoint = "mediaUploader",
}: UploadThingUploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress({})

    try {
      // Initialize progress for all files
      const initialProgress: Record<string, number> = {}
      files.forEach((file) => {
        initialProgress[file.name] = 0
      })
      setUploadProgress(initialProgress)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          files.forEach((file) => {
            if (newProgress[file.name] < 90) {
              newProgress[file.name] = Math.min(90, newProgress[file.name] + Math.random() * 15)
            }
          })
          return newProgress
        })
      }, 200)

      // Use UploadThing's client-side upload
      const uploadedFiles: UploadedFile[] = []

      for (const file of files) {
        try {
          // Create FormData for each file
          const formData = new FormData()
          formData.append("files", file)

          // Call UploadThing API directly
          const response = await fetch("/api/uploadthing", {
            method: "POST",
            body: formData,
            headers: {
              "x-uploadthing-package": "@uploadthing/react",
              "x-uploadthing-version": "6.2.2",
            },
          })

          if (response.ok) {
            const result = await response.json()
            console.log("Upload result:", result)

            // Handle different response formats
            if (Array.isArray(result)) {
              result.forEach((fileResult) => {
                if (fileResult && fileResult.url) {
                  uploadedFiles.push({
                    url: fileResult.url,
                    key: fileResult.key || fileResult.fileKey || "",
                    name: fileResult.name || file.name,
                    size: fileResult.size || file.size,
                    type: fileResult.type || file.type,
                  })
                }
              })
            } else if (result && result.url) {
              uploadedFiles.push({
                url: result.url,
                key: result.key || result.fileKey || "",
                name: result.name || file.name,
                size: result.size || file.size,
                type: result.type || file.type,
              })
            }
          } else {
            const errorText = await response.text()
            console.error("Upload failed:", errorText)
            throw new Error(`Upload failed for ${file.name}`)
          }
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError)
          throw fileError
        }
      }

      clearInterval(progressInterval)

      // Complete progress
      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        files.forEach((file) => {
          newProgress[file.name] = 100
        })
        return newProgress
      })

      setTimeout(() => {
        if (uploadedFiles.length > 0) {
          onUpload(uploadedFiles)
        }
        setUploading(false)
        setUploadProgress({})
      }, 500)
    } catch (error) {
      console.error("Upload Error:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setUploading(false)
      setUploadProgress({})
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFiles(acceptedFiles)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple,
    disabled: uploading,
    maxSize: endpoint === "videoUploader" ? 16 * 1024 * 1024 : 4 * 1024 * 1024,
  })

  const handleRemoveFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index)
    onUpload(newFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />
    return <FileIcon className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
            <p className="text-amber-600 mb-2">Uploading...</p>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="w-full max-w-xs mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="truncate">{fileName}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{multiple ? "Drag and drop files here" : "Drag and drop a file here"}</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <Button variant="outline" type="button">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose {multiple ? "Files" : "File"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported: Images (PNG, JPG, GIF), Videos (MP4, MOV) • Max {endpoint === "videoUploader" ? "16MB" : "4MB"}
            </p>
          </>
        )}
      </div>

      {/* Current Files Display */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({currentFiles.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="border rounded-lg p-3 bg-white shadow-sm">
                  {file.type.startsWith("image/") ? (
                    <div className="relative aspect-video mb-2 overflow-hidden rounded">
                      <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video mb-2 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

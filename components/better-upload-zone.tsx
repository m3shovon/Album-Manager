"use client"

import { useState } from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image"

interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

interface BetterUploadZoneProps {
  onUpload: (files: UploadedFile[]) => void
  currentFiles?: UploadedFile[]
  multiple?: boolean
  className?: string
  endpoint?: "imageUploader" | "videoUploader" | "mediaUploader"
}

export default function BetterUploadZone({
  onUpload,
  currentFiles = [],
  multiple = false,
  className = "",
  endpoint = "mediaUploader",
}: BetterUploadZoneProps) {
  const [uploading, setUploading] = useState(false)

  const handleRemoveFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index)
    onUpload(newFiles)
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
      {!uploading && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            console.log("Files uploaded:", res)
            const uploadedFiles: UploadedFile[] = res.map((file) => ({
              url: file.url,
              key: file.key,
              name: file.name,
              size: file.size,
              type: file.type || "image/jpeg",
            }))

            if (multiple) {
              onUpload([...currentFiles, ...uploadedFiles])
            } else {
              onUpload(uploadedFiles)
            }
            setUploading(false)
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error)
            alert(`Upload failed: ${error.message}`)
            setUploading(false)
          }}
          onUploadBegin={(name) => {
            console.log("Upload started:", name)
            setUploading(true)
          }}
          appearance={{
            container: "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-amber-400 transition-colors",
            uploadIcon: "text-gray-400 mb-4",
            label: "text-gray-600 mb-2",
            allowedContent: "text-xs text-gray-500 mt-2",
            button:
              "bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg font-medium transition-colors ut-ready:bg-amber-800 ut-uploading:bg-amber-600",
          }}
          content={{
            label: multiple ? "Choose files or drag and drop" : "Choose file or drag and drop",
            allowedContent: `Max ${endpoint === "videoUploader" ? "16MB" : "4MB"} • Images & Videos`,
          }}
        />
      )}

      {uploading && (
        <div className="border-2 border-dashed border-amber-500 bg-amber-50 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-amber-600">Uploading files...</p>
        </div>
      )}

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
                      <ImageIcon className="w-8 h-8 text-gray-400" />
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

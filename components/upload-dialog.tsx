"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface UploadDialogProps {
  onClose: () => void
}

export default function UploadDialog({ onClose }: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [caption, setCaption] = useState("")

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

    const droppedFiles = Array.from(e.dataTransfer.files)
    const imageFiles = droppedFiles.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
    setFiles((prev) => [...prev, ...imageFiles])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    // Here you would integrate with UploadThing
    console.log("Uploading files:", files)
    console.log("Caption:", caption)

    // Simulate upload
    setTimeout(() => {
      alert("Files uploaded successfully! (This is a demo)")
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Upload Media</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your images or videos here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Choose Files</span>
              </Button>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({files.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Video className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption for your media..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          {/* Upload button */}
          <Button onClick={handleUpload} disabled={files.length === 0} className="w-full">
            Upload {files.length > 0 && `(${files.length} files)`}
          </Button>

          <p className="text-xs text-gray-500 text-center">Supported formats: JPG, PNG, GIF, MP4, MOV</p>
        </div>
      </div>
    </div>
  )
}

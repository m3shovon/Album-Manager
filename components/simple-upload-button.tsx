"use client"
import { UploadButton } from "@/lib/uploadthing"

interface SimpleUploadButtonProps {
  onUpload: (files: Array<{ url: string; key: string; name: string; size: number; type: string }>) => void
  endpoint?: "imageUploader" | "videoUploader" | "mediaUploader"
  multiple?: boolean
}

export default function SimpleUploadButton({
  onUpload,
  endpoint = "mediaUploader",
  multiple = false,
}: SimpleUploadButtonProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          console.log("Files: ", res)
          const uploadedFiles = res.map((file) => ({
            url: file.url,
            key: file.key,
            name: file.name,
            size: file.size,
            type: file.type || "image/jpeg",
          }))
          onUpload(uploadedFiles)
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
        appearance={{
          button: "bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg font-medium transition-colors",
          allowedContent: "text-xs text-gray-500 mt-2",
        }}
      />
    </div>
  )
}

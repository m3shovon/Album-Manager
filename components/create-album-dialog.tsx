"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import WorkingUploadZone from "@/components/working-upload-zone"
import Image from "next/image"

interface CreateAlbumDialogProps {
  onClose: () => void
  onSuccess: () => void
}

interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

export default function CreateAlbumDialog({ onClose, onSuccess }: CreateAlbumDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    is_public: false,
  })
  const [coverImage, setCoverImage] = useState<UploadedFile | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCoverImageUpload = (files: UploadedFile[]) => {
    if (files.length > 0) {
      setCoverImage(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setLoading(true)
    try {
      const albumData = {
        ...formData,
        cover_image_url: coverImage?.url || "",
        cover_image_key: coverImage?.key || "",
      }

      const response = await fetch("http://localhost:8000/api/albums/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(albumData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        console.error("Error creating album:", error)
        alert("Failed to create album")
      }
    } catch (error) {
      console.error("Error creating album:", error)
      alert("Error creating album")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-amber-900">Create New Album</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative max-w-xs mx-auto">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-gray-200">
                  <Image src={coverImage.url || "/placeholder.svg"} alt="Cover image" fill className="object-cover" />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => setCoverImage(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="max-w-xs mx-auto">
                <WorkingUploadZone onUpload={handleCoverImageUpload} endpoint="imageUploader" multiple={false} />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Album Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter album title"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Enter album subtitle"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your album..."
              rows={3}
            />
          </div>

          {/* Public checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleInputChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_public">Make this album public</Label>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="bg-amber-800 hover:bg-amber-900"
            >
              {loading ? "Creating..." : "Create Album"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

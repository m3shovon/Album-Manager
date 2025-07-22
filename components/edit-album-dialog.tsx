"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import WorkingUploadZone from "@/components/working-upload-zone"
import PageEditor from "@/components/page-editor"
import Image from "next/image"

interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

interface Album {
  id: string
  title: string
  subtitle: string
  description?: string
  cover_image_url: string
  cover_image_key?: string
  is_public?: boolean
  pages: Array<{
    id: string
    title: string
    page_number: number
    items: Array<{
      type: "image" | "video"
      src: string
      caption: string
      duration?: string
    }>
  }>
}

interface EditAlbumDialogProps {
  album: Album
  onClose: () => void
  onSuccess: () => void
}

export default function EditAlbumDialog({ album, onClose, onSuccess }: EditAlbumDialogProps) {
  const [formData, setFormData] = useState({
    title: album.title,
    subtitle: album.subtitle,
    description: album.description || "",
    is_public: album.is_public || false,
  })
  const [coverImage, setCoverImage] = useState<UploadedFile | null>(
    album.cover_image_url
      ? {
          url: album.cover_image_url,
          key: album.cover_image_key || "",
          name: "cover-image",
          size: 0,
          type: "image/jpeg",
        }
      : null,
  )
  const [loading, setLoading] = useState(false)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [showAddPage, setShowAddPage] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState("")

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

      const response = await fetch(`http://localhost:8000/api/albums/${album.id}/`, {
        method: "PATCH",
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
        console.error("Error updating album:", error)
        alert("Failed to update album")
      }
    } catch (error) {
      console.error("Error updating album:", error)
      alert("Error updating album")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPage = async () => {
    if (!newPageTitle.trim()) return

    try {
      const response = await fetch(`http://localhost:8000/api/albums/${album.id}/add_page/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPageTitle,
          page_number: album.pages.length + 1,
        }),
      })

      if (response.ok) {
        setNewPageTitle("")
        setShowAddPage(false)
        onSuccess()
      } else {
        alert("Failed to add page")
      }
    } catch (error) {
      console.error("Error adding page:", error)
      alert("Error adding page")
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const response = await fetch(`http://localhost:8000/api/pages/${pageId}/`, {
        method: "DELETE",
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert("Failed to delete page")
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      alert("Error deleting page")
    }
  }

  if (editingPage) {
    const page = album.pages.find((p) => p.id === editingPage)
    if (page) {
      return <PageEditor page={page} onClose={() => setEditingPage(null)} onSuccess={onSuccess} />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-amber-900">Edit Album</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Album Details */}
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Album Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  {coverImage ? (
                    <div className="relative max-w-xs">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-gray-200">
                        <Image
                          src={coverImage.url || "/placeholder.svg"}
                          alt="Cover image"
                          fill
                          className="object-cover"
                        />
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
                    <div className="max-w-xs">
                      <WorkingUploadZone onUpload={handleCoverImageUpload} endpoint="imageUploader" multiple={false} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Album Title *</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
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

                <Button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                  className="bg-amber-800 hover:bg-amber-900 w-full"
                >
                  {loading ? "Updating..." : "Update Album"}
                </Button>
              </form>
            </div>

            {/* Pages Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-amber-900">Pages</h3>
                <Button onClick={() => setShowAddPage(true)} size="sm" className="bg-amber-800 hover:bg-amber-900">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Page
                </Button>
              </div>

              {/* Add Page Form */}
              {showAddPage && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        placeholder="Page title"
                        onKeyPress={(e) => e.key === "Enter" && handleAddPage()}
                      />
                      <Button onClick={handleAddPage} size="sm">
                        Add
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddPage(false)
                          setNewPageTitle("")
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pages List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {album.pages.map((page) => (
                  <Card key={page.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-amber-900">{page.title}</h4>
                            <p className="text-sm text-amber-600">
                              Page {page.page_number} • {page.items.length} items
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" onClick={() => setEditingPage(page.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeletePage(page.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

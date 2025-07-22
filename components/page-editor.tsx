"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import WorkingUploadZone from "@/components/working-upload-zone"

interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

interface MediaItem {
  id?: string
  type: "image" | "video"
  src: string
  caption: string
  duration?: string
  file_key?: string
  position?: number
}

interface Page {
  id: string
  title: string
  page_number: number
  items: MediaItem[]
}

interface PageEditorProps {
  page: Page
  onClose: () => void
  onSuccess: () => void
}

export default function PageEditor({ page, onClose, onSuccess }: PageEditorProps) {
  const [pageTitle, setPageTitle] = useState(page.title)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  useEffect(() => {
    fetchPageMedia()
  }, [page.id])

  const fetchPageMedia = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/pages/${page.id}/media/`)
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data)
      }
    } catch (error) {
      console.error("Error fetching page media:", error)
    }
  }

  const handleUpdatePageTitle = async () => {
    if (!pageTitle.trim()) return

    try {
      const response = await fetch(`http://localhost:8000/api/pages/${page.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: pageTitle }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert("Failed to update page title")
      }
    } catch (error) {
      console.error("Error updating page title:", error)
      alert("Error updating page title")
    }
  }

  const handleAddMedia = async (files: UploadedFile[]) => {
    for (const file of files) {
      try {
        const mediaType = file.type.startsWith("image/") ? "image" : "video"
        const response = await fetch(`http://localhost:8000/api/pages/${page.id}/add_media/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: mediaType,
            file_url: file.url,
            file_key: file.key,
            caption: "",
            position: mediaItems.length,
          }),
        })

        if (!response.ok) {
          alert(`Failed to add ${file.name}`)
        }
      } catch (error) {
        console.error("Error adding media:", error)
        alert(`Error adding ${file.name}`)
      }
    }
    fetchPageMedia()
  }

  const handleUpdateCaption = async (mediaId: string, caption: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/media/${mediaId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption }),
      })

      if (!response.ok) {
        alert("Failed to update caption")
      }
    } catch (error) {
      console.error("Error updating caption:", error)
      alert("Error updating caption")
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      const response = await fetch(`http://localhost:8000/api/media/${mediaId}/delete_from_uploadthing/`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPageMedia()
      } else {
        alert("Failed to delete media")
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      alert("Error deleting media")
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newItems = [...mediaItems]
    const draggedMediaItem = newItems[draggedItem]
    newItems.splice(draggedItem, 1)
    newItems.splice(dropIndex, 0, draggedMediaItem)

    setMediaItems(newItems)
    setDraggedItem(null)

    // Update positions on server
    handleReorderMedia(newItems.map((item) => item.id).filter(Boolean) as string[])
  }

  const handleReorderMedia = async (mediaOrder: string[]) => {
    try {
      await fetch(`http://localhost:8000/api/pages/${page.id}/reorder_media/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ media_order: mediaOrder }),
      })
    } catch (error) {
      console.error("Error reordering media:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-amber-900">Edit Page</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <Label htmlFor="pageTitle">Page Title</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="pageTitle"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Enter page title"
              />
              <Button onClick={handleUpdatePageTitle} className="bg-amber-800 hover:bg-amber-900">
                Update
              </Button>
            </div>
          </div>

          {/* Add Media */}
          <div className="mb-6">
            <Label>Add Images/Videos</Label>
            <div className="mt-2">
              <WorkingUploadZone onUpload={handleAddMedia} endpoint="mediaUploader" multiple={true} />
            </div>
          </div>

          {/* Media Items */}
          <div className="space-y-4">
            <Label>Media Items ({mediaItems.length})</Label>
            {mediaItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No media items yet. Add some images or videos above.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                  <Card
                    key={item.id || index}
                    className="group cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <CardContent className="p-4">
                      <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                        <Image src={item.src || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
                        <div className="absolute top-2 left-2">
                          <GripVertical className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => item.id && handleDeleteMedia(item.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={item.caption}
                        onChange={(e) => {
                          const newItems = [...mediaItems]
                          newItems[index].caption = e.target.value
                          setMediaItems(newItems)
                        }}
                        onBlur={() => item.id && handleUpdateCaption(item.id, item.caption)}
                        placeholder="Add a caption..."
                        rows={2}
                        className="text-sm"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

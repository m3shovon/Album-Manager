"use client"

import { useState } from "react"
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateAlbumDialog from "@/components/create-album-dialog"
import EditAlbumDialog from "@/components/edit-album-dialog"
import Image from "next/image"

interface Album {
  id: string
  title: string
  subtitle: string
  cover_image_url: string
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

interface AlbumManagerProps {
  albums: Album[]
  onAlbumSelect: (album: Album) => void
  onAlbumUpdate: () => void
}

export default function AlbumManager({ albums, onAlbumSelect, onAlbumUpdate }: AlbumManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)

  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return

    try {
      const response = await fetch(`http://localhost:8000/api/albums/${albumId}/`, {
        method: "DELETE",
      })

      if (response.ok) {
        onAlbumUpdate()
      } else {
        alert("Failed to delete album")
      }
    } catch (error) {
      console.error("Error deleting album:", error)
      alert("Error deleting album")
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">My Albums</h1>
          <p className="text-amber-700">Create and manage your photo albums</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-amber-800 hover:bg-amber-900 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Create Album
        </Button>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-amber-800 mb-2">No albums yet</h2>
          <p className="text-amber-600 mb-6">Create your first album to get started</p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-amber-800 hover:bg-amber-900 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Album
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                  <Image
                    src={album.cover_image_url || "/placeholder.svg?height=400&width=300&text=No+Cover"}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingAlbum(album)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAlbum(album.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4" onClick={() => onAlbumSelect(album)}>
                <CardTitle className="text-lg font-bold text-amber-900 mb-1 line-clamp-1">{album.title}</CardTitle>
                <p className="text-amber-700 text-sm mb-2 line-clamp-1">{album.subtitle}</p>
                <p className="text-amber-600 text-xs">
                  {album.pages.length} {album.pages.length === 1 ? "page" : "pages"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Album Dialog */}
      {showCreateDialog && <CreateAlbumDialog onClose={() => setShowCreateDialog(false)} onSuccess={onAlbumUpdate} />}

      {/* Edit Album Dialog */}
      {editingAlbum && (
        <EditAlbumDialog album={editingAlbum} onClose={() => setEditingAlbum(null)} onSuccess={onAlbumUpdate} />
      )}
    </div>
  )
}

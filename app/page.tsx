"use client"

import { useState, useEffect } from "react"
import AlbumManager from "@/components//album-manager"
import RealisticAlbumBook from "@/components/realistic-album-book"

interface AlbumData {
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

export default function Home() {
  const [albums, setAlbums] = useState<AlbumData[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null)
  const [isViewingAlbum, setIsViewingAlbum] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch albums from backend
  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/albums/")
      if (response.ok) {
        const data = await response.json()
        setAlbums(data.results || data)
      }
    } catch (error) {
      console.error("Error fetching albums:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  const handleAlbumSelect = (album: AlbumData) => {
    setSelectedAlbum(album)
    setIsViewingAlbum(true)
  }

  const handleAlbumClose = () => {
    setIsViewingAlbum(false)
    setSelectedAlbum(null)
  }

  const handleAlbumUpdate = () => {
    fetchAlbums() // Refresh albums list
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl">Loading albums...</div>
      </div>
    )
  }

  if (isViewingAlbum && selectedAlbum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 flex items-center justify-center">
        <RealisticAlbumBook album={selectedAlbum} onClose={handleAlbumClose} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <AlbumManager albums={albums} onAlbumSelect={handleAlbumSelect} onAlbumUpdate={handleAlbumUpdate} />
    </div>
  )
}

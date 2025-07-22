"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import AlbumPageComponent from "@/components/album-page"
import UploadDialog from "@/components/upload-dialog"

interface AlbumItem {
  type: "image" | "video"
  src: string
  caption: string
  duration?: string
}

interface AlbumPage {
  id: number
  items: AlbumItem[]
}

interface AlbumViewerProps {
  album: {
    title: string
    pages: AlbumPage[]
  }
  onClose: () => void
}

export default function AlbumViewer({ album, onClose }: AlbumViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const totalPages = album.pages.length

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextPage()
    } else if (isRightSwipe) {
      prevPage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Upload button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10 text-white hover:bg-white/20"
        onClick={() => setShowUpload(true)}
      >
        <Upload className="w-6 h-6" />
      </Button>

      {/* Album title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <h2 className="text-white text-xl font-semibold">{album.title}</h2>
      </div>

      {/* Page counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentPage + 1} / {totalPages}
        </div>
      </div>

      {/* Navigation buttons */}
      {currentPage > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
          onClick={prevPage}
          disabled={isFlipping}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {currentPage < totalPages - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
          onClick={nextPage}
          disabled={isFlipping}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Album pages */}
      <div
        className="relative w-full max-w-4xl h-full max-h-[80vh] mx-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full h-full perspective-1000">
          <div
            className={`absolute inset-0 transition-transform duration-300 transform-gpu ${
              isFlipping ? "rotate-y-180" : ""
            }`}
          >
            <AlbumPageComponent page={album.pages[currentPage]} />
          </div>
        </div>
      </div>

      {/* Upload dialog */}
      {showUpload && <UploadDialog onClose={() => setShowUpload(false)} />}
    </div>
  )
}
